import { BaseService } from "./base.service.js";
import {
  Sales,
  SalesItem,
  Purchase,
  PurchaseItem,
  Batch,
  Product,
  Supplier,
  Customer,
  Payment
} from "../models/index.js";
import { Op, Sequelize } from "sequelize";

export class ReportService extends BaseService {

  // ------------------------------------------------
  // SALES REPORT
  // ------------------------------------------------
  async salesReport({ from_date, to_date }) {
    const where = {};

    if (from_date && to_date) {
      where[Op.and] = [
        Sequelize.where(Sequelize.fn("DATE", Sequelize.col("invoice_date")), { [Op.gte]: from_date }),
        Sequelize.where(Sequelize.fn("DATE", Sequelize.col("invoice_date")), { [Op.lte]: to_date }),
      ];
    }

    const rows = await Sales.findAll({
      where,
      include: [
        { model: Customer, as: "customer" },
        {
          model: SalesItem,
          as: "items",
          include: [
            { model: Product, as: "product" },
            { model: Batch, as: "batch" }
          ]
        }
      ],
      order: [["invoice_date", "DESC"]]
    });

    return this.success("Sales report", rows);
  }

  // ------------------------------------------------
  // PURCHASE REPORT
  // ------------------------------------------------
  async purchaseReport({ from_date, to_date }) {
    const where = {};

    if (from_date && to_date) {
      where[Op.and] = [
        Sequelize.where(Sequelize.fn("DATE", Sequelize.col("invoice_date")), { [Op.gte]: from_date }),
        Sequelize.where(Sequelize.fn("DATE", Sequelize.col("invoice_date")), { [Op.lte]: to_date }),
      ];
    }

    const rows = await Purchase.findAll({
      where,
      include: [
        { model: Supplier, as: "supplier" },
        {
          model: PurchaseItem,
          as: "items",
          include: [{ model: Product, as: "product" }]
        }
      ],
      order: [["invoice_date", "DESC"]]
    });

    return this.success("Purchase report", rows);
  }

  // ------------------------------------------------
  // STOCK REPORT
  // ------------------------------------------------
  async stockReport() {
    const batches = await Batch.findAll({
      include: [{ model: Product, as: "product" }],
      order: [["expiry_date", "ASC"]]
    });

    const grouped = {};

    for (const batch of batches) {
      const pid = batch.product_id;

      if (!grouped[pid]) {
        grouped[pid] = {
          product: batch.product,
          total_qty: 0,
          batches: []
        };
      }

      grouped[pid].total_qty += batch.quantity;
      grouped[pid].batches.push(batch);
    }

    return this.success("Stock report", Object.values(grouped));
  }

  // ------------------------------------------------
  // NEAR EXPIRY REPORT
  // ------------------------------------------------
  async nearExpiryReport({ days = 30 }) {
    const now = new Date();
    const target = new Date();
    target.setDate(now.getDate() + Number(days));

    const nowDate = now.toISOString().slice(0, 10);
    const targetDate = target.toISOString().slice(0, 10);

    const rows = await Batch.findAll({
      where: {
        [Op.and]: [
          Sequelize.where(Sequelize.fn("DATE", Sequelize.col("expiry_date")), { [Op.gte]: nowDate }),
          Sequelize.where(Sequelize.fn("DATE", Sequelize.col("expiry_date")), { [Op.lte]: targetDate }),
        ]
      },
      include: [{ model: Product, as: "product" }],
      order: [["expiry_date", "ASC"]]
    });

    return this.success("Near expiry report", rows);
  }

  // ------------------------------------------------
  // PROFIT - LOSS REPORT
  // ------------------------------------------------
  async profitLossReport({ from_date, to_date }) {
    const saleWhere = {};

    if (from_date && to_date) {
      saleWhere[Op.and] = [
        Sequelize.where(Sequelize.fn("DATE", Sequelize.col("invoice_date")), { [Op.gte]: from_date }),
        Sequelize.where(Sequelize.fn("DATE", Sequelize.col("invoice_date")), { [Op.lte]: to_date }),
      ];
    }

    const salesItems = await SalesItem.findAll({
      include: [
        { model: Product, as: "product" },
        { model: Batch, as: "batch" },
        {
          model: Sales,
          as: "sale",
          where: saleWhere,
          required: true
        }
      ]
    });

    let totalRevenue = 0;
    let totalCost = 0;

    for (const item of salesItems) {
      const revenue = item.quantity * item.price;
      const cost = item.quantity * (item.batch?.purchase_price || 0);

      totalRevenue += revenue;
      totalCost += cost;
    }

    return this.success("Profit/Loss report", {
      totalRevenue,
      totalCost,
      profit: totalRevenue - totalCost
    });
  }

  // ------------------------------------------------
  // CUSTOMER LEDGER
  // ------------------------------------------------
  async customerLedger(id) {
    const sales = await Sales.findAll({
      where: { customer_id: id },
      include: [
        { model: Customer, as: "customer" },
        {
          model: SalesItem,
          as: "items",
          include: [
            { model: Product, as: "product" },
            { model: Batch, as: "batch" }
          ]
        }
      ],
      order: [["invoice_date", "ASC"]]
    });

    const payments = await Payment.findAll({
      where: { customer_id: id, payment_type: "customer" },
      include: [{ model: Customer, as: "customer" }],
      order: [["createdAt", "ASC"]]
    });

    return this.success("Customer ledger", { sales, payments });
  }

  // ------------------------------------------------
  // SUPPLIER LEDGER
  // ------------------------------------------------
  async supplierLedger(id) {
    const purchases = await Purchase.findAll({
      where: { supplier_id: id },
      include: [
        { model: Supplier, as: "supplier" },
        {
          model: PurchaseItem,
          as: "items",
          include: [{ model: Product, as: "product" }]
        }
      ],
      order: [["invoice_date", "ASC"]]
    });

    const payments = await Payment.findAll({
      where: { supplier_id: id, payment_type: "supplier" },
      include: [{ model: Supplier, as: "supplier" }],
      order: [["createdAt", "ASC"]]
    });

    return this.success("Supplier ledger", { purchases, payments });
  }

  // ------------------------------------------------
  // DAILY SUMMARY
  // ------------------------------------------------
  async dailySummary({ date }) {
    if (!date) this.error("date is required", 400);

    const dateOnly = date;

    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    const sales = await Sales.sum("net_total", {
      where: Sequelize.where(
        Sequelize.fn("DATE", Sequelize.col("invoice_date")),
        dateOnly
      )
    });

    const purchases = await Purchase.sum("total_amount", {
      where: Sequelize.where(
        Sequelize.fn("DATE", Sequelize.col("invoice_date")),
        dateOnly
      )
    });

    const customerPayments = await Payment.sum("amount", {
      where: {
        payment_type: "customer",
        createdAt: { [Op.between]: [dayStart, dayEnd] }
      }
    });

    const supplierPayments = await Payment.sum("amount", {
      where: {
        payment_type: "supplier",
        createdAt: { [Op.between]: [dayStart, dayEnd] }
      }
    });

    return this.success("Daily summary", {
      sales: sales || 0,
      purchases: purchases || 0,
      customerPayments: customerPayments || 0,
      supplierPayments: supplierPayments || 0
    });
  }

  // ------------------------------------------------
  // PRODUCT-WISE SALES REPORT
  // ------------------------------------------------
  async productSales({ product_id, from_date, to_date }) {
    const where = {};
    const saleWhere = {};

    if (product_id) where.product_id = product_id;

    if (from_date && to_date) {
      saleWhere[Op.and] = [
        Sequelize.where(Sequelize.fn("DATE", Sequelize.col("sale.invoice_date")), {
          [Op.gte]: from_date
        }),
        Sequelize.where(Sequelize.fn("DATE", Sequelize.col("sale.invoice_date")), {
          [Op.lte]: to_date
        }),
      ];
    }

    const rows = await SalesItem.findAll({
      where,
      include: [
        { model: Product, as: "product" },
        { model: Batch, as: "batch" },
        {
          model: Sales,
          as: "sale",
          where: saleWhere,
          required: true,
          include: [{ model: Customer, as: "customer" }]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    return this.success("Product-wise sales", rows);
  }

  // ------------------------------------------------
  // BATCH-WISE STOCK REPORT
  // ------------------------------------------------
  async batchStock(productId) {
    const rows = await Batch.findAll({
      where: { product_id: productId },
      include: [{ model: Product, as: "product" }],
      order: [["expiry_date", "ASC"]]
    });

    return this.success("Batch wise stock", rows);
  }
}
