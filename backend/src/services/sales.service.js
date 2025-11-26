import { BaseService } from "./base.service.js";
import {
  Sales,
  SalesItem,
  Batch,
  Product,
  Customer
} from "../models/index.js";
import { Op, Sequelize } from "sequelize";
import moment from "moment";


export class SalesService extends BaseService {
  /**
   * Create Sale with FEFO stock deduction
   *
   * Expected Body:
   * {
   *   customer_id,
   *   invoice_date,
   *   discount,
   *   total,
   *   net_total,
   *   items: [
   *     { product_id, quantity, price }
   *   ]
   * }
   */
  async create(data) {
    return this.runTransaction(async (t) => {
      const { customer_id, invoice_date, discount = 0, items } = data;

      if (!items || items.length === 0) {
        this.error("Sale must include at least 1 item", 400);
      }

      // Check customer exists
      const customer = await Customer.findByPk(customer_id, { transaction: t });
      if (!customer) this.error("Customer not found", 404);

      let total = 0;

      // First pass: calculate total
      for (const item of items) {
        total += item.quantity * item.price;
      }

      // Apply percentage discount
      const discountAmount = (total * discount) / 100;
      const net_total = total - discountAmount;

      // Create Sale with calculated totals
      const sale = await Sales.create(
        {
          customer_id,
          invoice_date,
          discount,          // store % discount
          total,             // gross total
          net_total,         // after discount
          discount_amount: discountAmount // OPTIONAL: store discount amount separately
        },
        { transaction: t }
      );

      const createdSaleItems = [];

      // FEFO logic stays the same...
      for (const item of items) {
        const { product_id, quantity, price } = item;

        const batches = await Batch.findAll({
          where: { product_id },
          order: [["expiry_date", "ASC"]],
          transaction: t
        });

        if (!batches || batches.length === 0) {
          this.error(`No stock available for product_id: ${product_id}`, 400);
        }

        let remainingQty = quantity;
        const batchDeductions = [];

        for (const batch of batches) {
          if (remainingQty <= 0) break;
          if (batch.quantity <= 0) continue;

          const deduct = Math.min(batch.quantity, remainingQty);

          batchDeductions.push({ batch, deduct });

          remainingQty -= deduct;
        }

        if (remainingQty > 0) {
          this.error(
            `Insufficient stock for product_id: ${product_id}. Required ${quantity}, available ${
              quantity - remainingQty
            }`,
            400
          );
        }

        // Apply deductions + create items
        for (const d of batchDeductions) {
          await d.batch.update(
            { quantity: d.batch.quantity - d.deduct },
            { transaction: t }
          );

          const saleItem = await SalesItem.create(
            {
              sales_id: sale.id,
              product_id,
              batch_id: d.batch.id,
              quantity: d.deduct,
              price,
              total: d.deduct * price
            },
            { transaction: t }
          );

          createdSaleItems.push(saleItem);
        }
      }

      return this.success("Sale created", {
        sale,
        items: createdSaleItems
      });
    });
  }



  async getAll() {
    try {
      const sales = await Sales.findAll({
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
        order: [["createdAt", "DESC"]]
      });

      return this.success("Sales fetched", sales);
    } catch (err) {
      this.error(err.message, 500);
    }
  }

  async getById(id) {
    try {
      const sale = await Sales.findByPk(id, {
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
        ]
      });

      if (!sale) this.error("Sale not found", 404);

      return this.success("Sale fetched", sale);
    } catch (err) {
      this.error(err.message, 500);
    }
  }
}
