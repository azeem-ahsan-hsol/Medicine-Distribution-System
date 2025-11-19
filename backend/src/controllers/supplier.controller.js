import { SupplierService } from "../services/supplier.service.js";

export class SupplierController {
  constructor() {
    this.svc = new SupplierService();
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

  async create(req, res, next) {
    try {
      const result = await this.svc.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await this.svc.update(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await this.svc.delete(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
