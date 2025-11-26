import { BaseService } from "./base.service.js";
import { Product } from "../models/product.model.js";
import { Op } from "sequelize";

export class ProductService extends BaseService {

  async getAll(page = 1, limit = 10) {
    page = Number(page);
    limit = Number(limit);

    const offset = (page - 1) * limit;

    const { rows: products, count: total } = await Product.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return this.success("Products fetched", {
      products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }

  async search(term) {
    // if no term, just return empty array (or you could call getAll)
    if (!term || !term.trim()) {
      return this.success("Products search (empty term)", []);
    }

    const q = term.trim();

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          // product_name LIKE %q%
          { product_name: { [Op.like]: `%${q}%` } },
          // generic_name LIKE %q%
          { generic_name: { [Op.like]: `%${q}%` } },
          // barcode exact or partial match
          { barcode: { [Op.like]: `%${q}%` } }
        ]
      },
      order: [["createdAt", "DESC"]]
    });

    return this.success("Products search result", products);
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
