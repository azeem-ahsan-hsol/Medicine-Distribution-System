import { BaseService } from "./base.service.js";
import {
  Sales,
  Purchase,
  Batch,
  Product,
  Customer,
  Supplier,
  Payment
} from "../models/index.js";
import { Op, Sequelize } from "sequelize";

export class DashboardService extends BaseService {
  /**
   * Dashboard summary:
   * - total_sales (sum sales.net_total)
   * - total_purchases (sum purchases.total_amount)
   * - stock_valuation (sum batch.quantity * batch.purchase_price)
   * - low_stock_count (products with total qty <= threshold)
   * - todays_revenue (sales net_total for today)
   * - outstanding_customer_balance (total sales - customer payments)
   * - outstanding_supplier_balance (total purchases - supplier payments)
   */
  async summary() {
    try {
      // 1) Total sales
      const totalSales = await Sales.sum("net_total").catch(() => null);

      // 2) Total purchases
      const totalPurchases = await Purchase.sum("total_amount").catch(() => null);

      // 3) Stock valuation (sum of batch.quantity * purchase_price)
      const stockRows = await Batch.findAll({
        attributes: [
          [Sequelize.literal("COALESCE(SUM(quantity * COALESCE(purchase_price, 0)),0)"), "value"]
        ],
        raw: true
      });
      const stockVal = stockRows && stockRows[0] && Number(stockRows[0].value) ? Number(stockRows[0].value) : 0;

      // 4) Low stock count (default threshold = 10)
      const LOW_LIMIT = 10;
      // compute per-product totals
      const productTotals = await Batch.findAll({
        attributes: [
          "product_id",
          [Sequelize.fn("SUM", Sequelize.col("quantity")), "total_qty"]
        ],
        group: ["product_id"],
        raw: true
      });

      const lowStockCount = productTotals.filter(p => Number(p.total_qty) <= LOW_LIMIT).length;

      // 5) Today's revenue
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const todaysRevenue = await Sales.sum("net_total", {
        where: { invoice_date: today }
      }).catch(() => 0);

      // 6) Outstanding customer balance = total sales (all time) - sum(customer payments)
      const sumCustomerPayments = await Payment.sum("amount", {
        where: { payment_type: "customer" }
      }).catch(() => 0);

      // total sales (as numeric)
      const totalSalesNumeric = Number(totalSales || 0);
      const outstandingCustomerBalance = totalSalesNumeric - Number(sumCustomerPayments || 0);

      // 7) Outstanding supplier balance = total purchases - sum(supplier payments)
      const sumSupplierPayments = await Payment.sum("amount", {
        where: { payment_type: "supplier" }
      }).catch(() => 0);

      const totalPurchasesNumeric = Number(totalPurchases || 0);
      const outstandingSupplierBalance = totalPurchasesNumeric - Number(sumSupplierPayments || 0);

      // 8) Low stock products list (top 10) - helpful for dashboard quick view
      const lowStockProducts = await Batch.findAll({
        attributes: [
          "product_id",
          [Sequelize.fn("SUM", Sequelize.col("quantity")), "total_qty"]
        ],
        group: ["product_id"],
        having: Sequelize.literal(`SUM(quantity) <= ${LOW_LIMIT}`),
        order: [[Sequelize.literal("total_qty"), "ASC"]],
        limit: 10,
        raw: true
      });

      // 9) Expiry alert count (items expiring within next 30 days)
      const expiryTarget = new Date();
      expiryTarget.setDate(expiryTarget.getDate() + 30);
      const expiryStr = expiryTarget.toISOString().slice(0, 10);

      const nearExpiryCount = await Batch.count({
        where: {
          expiry_date: {
            [Op.lte]: expiryStr
          }
        }
      });

      // 10) Totals counts for KPIs
      const totalProducts = await Product.count().catch(() => 0);
      const totalCustomers = await Customer.count().catch(() => 0);
      const totalSuppliers = await Supplier.count().catch(() => 0);

      const payload = {
        totalSales: Number(totalSales || 0),
        totalPurchases: Number(totalPurchases || 0),
        stockValuation: Number(stockVal),
        lowStockCount,
        todaysRevenue: Number(todaysRevenue || 0),
        outstandingCustomerBalance: Number(outstandingCustomerBalance || 0),
        outstandingSupplierBalance: Number(outstandingSupplierBalance || 0),
        lowStockProducts,
        nearExpiryCount,
        totalProducts: Number(totalProducts || 0),
        totalCustomers: Number(totalCustomers || 0),
        totalSuppliers: Number(totalSuppliers || 0),
        asOf: new Date().toISOString()
      };

      return this.success("Dashboard summary", payload);
    } catch (err) {
      this.error(err.message || "Failed to fetch dashboard summary", 500);
    }
  }
}
