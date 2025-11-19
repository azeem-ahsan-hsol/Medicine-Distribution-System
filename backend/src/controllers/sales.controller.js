import { SalesService } from "../services/sales.service.js";

export class SalesController {
  constructor() {
    this.svc = new SalesService();
  }

  async create(req, res, next) {
    try {
      const result = await this.svc.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      res.json(await this.svc.getAll());
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      res.json(await this.svc.getById(req.params.id));
    } catch (err) {
      next(err);
    }
  }
}
