import { BaseService } from "./base.service.js";
import {
  Purchase,
  PurchaseItem,
  Batch,
  Product,
  Supplier
} from "../models/index.js"; // adjust path if your export location differs

export class PurchaseService extends BaseService {
  /**
   * Create purchase with items and batches.
   * Request body expected:
   * {
   *   supplier_id,
   *   invoice_no,
   *   invoice_date,
   *   total_amount,
   *   items: [
   *     { product_id, batch_no, expiry_date, quantity, free_qty, cost_price, mfg_date? }
   *   ]
   * }
   */
  async create(data) {
    return this.runTransaction(async (t) => {
      const { supplier_id, invoice_no, invoice_date, total_amount, items } = data;

      // Basic validation
      if (!items || !Array.isArray(items) || items.length === 0) {
        this.error("Purchase must include at least one item", 400);
      }

      // Create purchase
      const purchase = await Purchase.create(
        {
          supplier_id,
          invoice_no,
          invoice_date,
          total_amount
        },
        { transaction: t }
      );

      // For each item: create PurchaseItem and Batch
      const createdItems = [];
      for (const it of items) {
        const {
          product_id,
          batch_no = null,
          expiry_date = null,
          quantity = 0,
          free_qty = 0,
          cost_price = null,
          mfg_date = null
        } = it;

        // Optional: check product exists (soft validation)
        const product = await Product.findByPk(product_id, { transaction: t });
        if (!product) {
          this.error(`Product not found (id: ${product_id})`, 404);
        }

        // Create purchase item
        const purchaseItem = await PurchaseItem.create(
          {
            purchase_id: purchase.id,
            product_id,
            batch_no,
            expiry_date,
            quantity,
            free_qty,
            cost_price
          },
          { transaction: t }
        );

        // Create / append batch entry (represents inventory batch)
        // We treat each purchase item as a new batch entry. If you want to merge by batch_no, change logic accordingly.
        const batch = await Batch.create(
          {
            product_id,
            batch_no,
            mfg_date,
            expiry_date,
            quantity,
            purchase_price: cost_price
          },
          { transaction: t }
        );

        // Optionally: update product's purchase_price to latest cost_price
        if (cost_price !== null) {
          await product.update(
            {
              purchase_price: cost_price
            },
            { transaction: t }
          );
        }

        createdItems.push({ purchaseItem, batch });
      }

      // Return purchase with created items (not re-fetching includes to keep performance — you can refetch below if you prefer)
      // Let's refetch purchase with items & supplier to return full object
      const created = await Purchase.findByPk(purchase.id, {
        include: [
          { model: Supplier, as: "supplier", required: false },
          {
            model: PurchaseItem,
            as: "items",
            required: false,
            include: [{ model: Product, as: "product", required: false }]
          }
        ],
        transaction: t
      });

      return this.success("Purchase created", created);
    });
  }

  async getAll(page = 1, limit = 10) {
    try {
      page = Number(page);
      limit = Number(limit);

      const offset = (page - 1) * limit;

      const { rows: purchases, count: total } = await Purchase.findAndCountAll({
        limit,
        offset,
        include: [
          { model: Supplier, as: "supplier", required: false },
          {
            model: PurchaseItem,
            as: "items",
            required: false,
            include: [{ model: Product, as: "product", required: false }]
          }
        ],
        order: [
          ["invoice_date", "DESC"],
          ["createdAt", "DESC"]
        ]
      });

      return this.success("Purchases fetched", {
        purchases,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });

    } catch (err) {
      this.error(err.message || "Failed to fetch purchases", 500);
    }
  }


  async getById(id) {
    try {
      const purchase = await Purchase.findByPk(id, {
        include: [
          { model: Supplier, as: "supplier" },
          {
            model: PurchaseItem,
            as: "items",
            include: [{ model: Product, as: "product" }]
          }
        ]
      });

      if (!purchase) this.error("Purchase not found", 404);

      return this.success("Purchase fetched", purchase);
    } catch (err) {
      this.error(err.message || "Failed to fetch purchase", 500);
    }
  }
}
