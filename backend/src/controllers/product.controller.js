import { ProductService } from "../services/product.service.js";

export class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query; // <-- read from query
      const response = await this.productService.getAll(page, limit);
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  // 🔍 NEW: search API
  async search(req, res, next) {
    try {
      const { q } = req.query; // ?q=paracetamol / ?q=5000123123 etc.
      const response = await this.productService.search(q);
      res.json(response);
    } catch (err) {
      next(err);
    }
  }


  async create(req, res, next) {
    try {
      res.json(await this.productService.create(req.body));
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      res.json(await this.productService.update(req.params.id, req.body));
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      res.json(await this.productService.delete(req.params.id));
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      res.json(await this.productService.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  }
  
}
