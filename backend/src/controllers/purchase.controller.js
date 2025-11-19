import { PurchaseService } from "../services/purchase.service.js";

export class PurchaseController {
  constructor() {
    this.svc = new PurchaseService();
  }

  async create(req, res, next) {
    try {
      // Expect body: { supplier_id, invoice_no, invoice_date, total_amount, items: [...] }
      const result = await this.svc.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const result = await this.svc.getAll();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await this.svc.getById(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
