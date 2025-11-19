import { BaseService } from "./base.service.js";
import {
  Product,
  Batch,
  Supplier
} from "../models/index.js";
import { Op } from "sequelize";

export class StockService extends BaseService {

  // ============================
  // 1. FULL STOCK LIST
  // ============================
  async getStock() {
    try {
      const batches = await Batch.findAll({
        include: [{ model: Product, as: "product" }],
        order: [["expiry_date", "ASC"]]
      });

      const grouped = {};

      for (const b of batches) {
        const pid = b.product_id;

        if (!grouped[pid]) {
          grouped[pid] = {
            product: b.product,       // FIXED alias
            total_quantity: 0,
            batches: []
          };
        }

        grouped[pid].total_quantity += b.quantity;
        grouped[pid].batches.push(b);
      }

      return this.success("Stock fetched", Object.values(grouped));
    } catch (err) {
      this.error(err.message || "Failed to fetch stock", 500);
    }
  }

  // ============================
  // 2. NEAR EXPIRY STOCK
  // ============================
  async nearExpiry() {
    try {
      const days = 30;
      const today = new Date();
      const target = new Date();
      target.setDate(today.getDate() + days);

      const nearExpiry = await Batch.findAll({
        where: {
          expiry_date: {
            [Op.lte]: target,
            [Op.gte]: today
          }
        },
        include: [{ model: Product, as: "product" }],
        order: [["expiry_date", "ASC"]]
      });

      return this.success("Near expiry stock", nearExpiry);
    } catch (err) {
      this.error(err.message || "Failed to fetch near-expiry stock", 500);
    }
  }

  // ============================
  // 3. LOW STOCK
  // ============================
  async lowStock() {
    try {
      const LOW_LIMIT = 10;

      const batches = await Batch.findAll({
        include: [{ model: Product, as: "product" }]
      });

      const grouped = {};

      for (const b of batches) {
        const pid = b.product_id;

        if (!grouped[pid]) {
          grouped[pid] = {
            product: b.product,
            total_quantity: 0
          };
        }

        grouped[pid].total_quantity += b.quantity;
      }

      const low = Object.values(grouped).filter(
        g => g.total_quantity <= LOW_LIMIT
      );

      return this.success("Low stock", low);
    } catch (err) {
      this.error(err.message || "Failed to fetch low stock", 500);
    }
  }

  // ============================
  // 4. ALL BATCHES OF A PRODUCT
  // ============================
  async getProductBatches(productId) {
    try {
      const batches = await Batch.findAll({
        where: { product_id: productId },
        include: [{ model: Product, as: "product" }],
        order: [["expiry_date", "ASC"]]
      });

      if (!batches.length) {
        this.error("No batches found for this product", 404);
      }

      return this.success("Product batches fetched", batches);
    } catch (err) {
      this.error(err.message || "Failed to fetch product batches", 500);
    }
  }

  // ============================
  // 5. SINGLE BATCH DETAIL
  // ============================
  async getBatchDetail(batchId) {
    try {
      const batch = await Batch.findByPk(batchId, {
        include: [{ model: Product, as: "product" }]
      });

      if (!batch) this.error("Batch not found", 404);

      return this.success("Batch detail fetched", batch);
    } catch (err) {
      this.error(err.message || "Failed to fetch batch detail", 500);
    }
  }
}
