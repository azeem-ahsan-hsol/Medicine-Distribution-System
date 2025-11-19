import { BaseService } from "./base.service.js";
import { Product } from "../models/product.model.js";

export class ProductService extends BaseService {
  async getAll() {
    const products = await Product.findAll();
    return this.success("Products fetched", products);
  }

  async create(data) {
    return this.runTransaction(async (t) => {
        const existing = await Product.findOne({ where: { barcode: data.barcode }, transaction: t });
        if (existing) this.error("Product with this barcode already exists", 400);

        const product = await Product.create(data, { transaction: t });
        return this.success("Product created", product);
    });
    }

  async update(id, data) {
    return this.runTransaction(async (t) => {
      const product = await Product.findByPk(id);
      if (!product) this.error("Product not found", 404);

      await product.update(data, { transaction: t });

      return this.success("Product updated", product);
    });
  }

  async delete(id) {
    return this.runTransaction(async (t) => {
      const product = await Product.findByPk(id);
      if (!product) this.error("Product not found", 404);

      await product.destroy({ transaction: t });

      return this.success("Product deleted");
    });
  }

  async getById(id) {
    try {
      const product = await Product.findByPk(id);
      if (!product) this.error("Product not found", 404);
      return this.success("Product fetched", product);
    } catch (err) {
      this.error(err.message || "Failed to fetch product", 500);
    }
  }
}
