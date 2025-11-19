import { BaseService } from "./base.service.js";
import {
  Return,
  ReturnItem,
  Sales,
  Purchase,
  Batch,
  Product,
  SalesItem,
  PurchaseItem,
  Customer,
  Supplier
} from "../models/index.js";
import { Op } from "sequelize";

export class ReturnService extends BaseService {
  // === SALES RETURN ===
  async createSalesReturn(data) {
    return this.runTransaction(async (t) => {
      const { sales_id, customer_id, notes, items } = data;

      if (!items || !Array.isArray(items) || items.length === 0) {
        this.error("Return must include at least one item", 400);
      }

      // Optional validations
      if (sales_id) {
        const sale = await Sales.findByPk(sales_id, { transaction: t });
        if (!sale) this.error("Sale not found", 404);
      }

      if (customer_id) {
        const customer = await Customer.findByPk(customer_id, { transaction: t });
        if (!customer) this.error("Customer not found", 404);
      }

      // Create parent return row
      const ret = await Return.create(
        {
          return_type: "sales",
          sales_id: sales_id || null,
          customer_id: customer_id || null,
          notes: notes || null
        },
        { transaction: t }
      );

      const createdItems = [];

      // For each return item: add quantity back to batch (or create new batch)
      for (const it of items) {
        const {
          product_id,
          sales_item_id = null,
          batch_id = null,
          batch_no = null,
          expiry_date = null,
          quantity,
          reason = null
        } = it;

        if (!product_id || !quantity || quantity <= 0) {
          this.error("Each return item requires product_id and positive quantity", 400);
        }

        // Find or create batch to add returned stock
        let batch = null;

        if (batch_id) {
          batch = await Batch.findByPk(batch_id, { transaction: t });
        } else if (batch_no) {
          batch = await Batch.findOne({ where: { product_id, batch_no }, transaction: t });
        }

        if (batch) {
          // Add returned qty back
          await batch.update({ quantity: batch.quantity + quantity }, { transaction: t });
        } else {
          // Create a new batch entry representing returned items
          batch = await Batch.create(
            {
              product_id,
              batch_no: batch_no || null,
              mfg_date: null,
              expiry_date: expiry_date || null,
              quantity,
              purchase_price: null // unknown for returns
            },
            { transaction: t }
          );
        }

        // Create return item
        const returnItem = await ReturnItem.create(
          {
            return_id: ret.id,
            product_id,
            sales_item_id,
            batch_id: batch.id,
            batch_no: batch.batch_no,
            expiry_date: batch.expiry_date,
            quantity,
            reason
          },
          { transaction: t }
        );

        createdItems.push(returnItem);
      }

      //using alias 'items' as defined in model associations
      const full = await Return.findByPk(ret.id, { include: [{ model: ReturnItem, as: "items" }], transaction: t });

      return this.success("Sales return recorded", full);
    });
  }

  // === PURCHASE RETURN ===
  async createPurchaseReturn(data) {
    return this.runTransaction(async (t) => {
      const { purchase_id, supplier_id, notes, items } = data;

      if (!items || !Array.isArray(items) || items.length === 0) {
        this.error("Return must include at least one item", 400);
      }

      if (purchase_id) {
        const purchase = await Purchase.findByPk(purchase_id, { transaction: t });
        if (!purchase) this.error("Purchase not found", 404);
      }

      if (supplier_id) {
        const supplier = await Supplier.findByPk(supplier_id, { transaction: t });
        if (!supplier) this.error("Supplier not found", 404);
      }

      const ret = await Return.create(
        {
          return_type: "purchase",
          purchase_id: purchase_id || null,
          supplier_id: supplier_id || null,
          notes: notes || null
        },
        { transaction: t }
      );

      const createdItems = [];

      // For purchase return, we will deduct from batch quantities (you may want to ensure you only deduct from specific batches)
      for (const it of items) {
        const {
          product_id,
          purchase_item_id = null,
          batch_id = null,
          batch_no = null,
          expiry_date = null,
          quantity,
          reason = null
        } = it;

        if (!product_id || !quantity || quantity <= 0) {
          this.error("Each return item requires product_id and positive quantity", 400);
        }

        // Determine batches to deduct from:
        // If batch_id provided => deduct exactly from that batch (validate availability)
        if (batch_id) {
          const batch = await Batch.findByPk(batch_id, { transaction: t });
          if (!batch) this.error(`Batch not found (id: ${batch_id})`, 404);
          if (batch.quantity < quantity) this.error(`Insufficient quantity in batch ${batch_id}`, 400);

          await batch.update({ quantity: batch.quantity - quantity }, { transaction: t });

          const returnItem = await ReturnItem.create(
            {
              return_id: ret.id,
              product_id,
              purchase_item_id,
              batch_id: batch.id,
              batch_no: batch.batch_no,
              expiry_date: batch.expiry_date,
              quantity,
              reason
            },
            { transaction: t }
          );
          createdItems.push(returnItem);
        } else if (batch_no) {
          // find batch by batch_no
          const batch = await Batch.findOne({ where: { product_id, batch_no }, transaction: t });
          if (!batch) this.error(`Batch not found (batch_no: ${batch_no})`, 404);
          if (batch.quantity < quantity) this.error(`Insufficient quantity in batch ${batch_no}`, 400);

          await batch.update({ quantity: batch.quantity - quantity }, { transaction: t });

          const returnItem = await ReturnItem.create(
            {
              return_id: ret.id,
              product_id,
              purchase_item_id,
              batch_id: batch.id,
              batch_no: batch.batch_no,
              expiry_date: batch.expiry_date,
              quantity,
              reason
            },
            { transaction: t }
          );
          createdItems.push(returnItem);
        } else {
          // No batch specified. Deduct from batches in LIFO or FEFO? For purchase-return we'll deduct from latest batches first (reverse of incoming)
          // We'll deduct from latest purchase batches (by createdAt desc)
          let remaining = quantity;
          const batches = await Batch.findAll({
            where: { product_id, quantity: { [Op.gt]: 0 } },
            order: [["createdAt", "DESC"]],
            transaction: t
          });

          if (!batches || batches.length === 0) this.error(`No stock available to return for product ${product_id}`, 400);

          for (const batch of batches) {
            if (remaining <= 0) break;
            if (batch.quantity <= 0) continue;

            const deduct = Math.min(batch.quantity, remaining);
            await batch.update({ quantity: batch.quantity - deduct }, { transaction: t });

            const returnItem = await ReturnItem.create(
              {
                return_id: ret.id,
                product_id,
                purchase_item_id,
                batch_id: batch.id,
                batch_no: batch.batch_no,
                expiry_date: batch.expiry_date,
                quantity: deduct,
                reason
              },
              { transaction: t }
            );

            createdItems.push(returnItem);
            remaining -= deduct;
          }

          if (remaining > 0) this.error(`Insufficient stock to process return for product ${product_id}`, 400);
        }
      }

      //using alias 'items' as defined in model associations
      const full = await Return.findByPk(ret.id, { include: [{ model: ReturnItem, as: "items" }], transaction: t });
      return this.success("Purchase return recorded", full);
    });
  }

  // Fetch sales returns
  async getSalesReturns() {
    try {

      //using alias 'items' as defined in model associations
      const rows = await Return.findAll({
        where: { return_type: "sales" },
        include: [{ model: ReturnItem, as: "items" }],
        order: [["createdAt", "DESC"]]
      });
      return this.success("Sales returns fetched", rows);
    } catch (err) {
      this.error(err.message || "Failed to fetch sales returns", 500);
    }
  }

  // Fetch purchase returns
  async getPurchaseReturns() {
    try {

      //alias 'items' as defined in model associations
      const rows = await Return.findAll({
        where: { return_type: "purchase" },
        include: [{ model: ReturnItem, as: "items" }],
        order: [["createdAt", "DESC"]]
      });
      return this.success("Purchase returns fetched", rows);
    } catch (err) {
      this.error(err.message || "Failed to fetch purchase returns", 500);
    }
  }
}
