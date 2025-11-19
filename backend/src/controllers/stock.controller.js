import { StockService } from "../services/stock.service.js";

export class StockController {
  constructor() {
    this.svc = new StockService();
  }

  async getStock(req, res, next) {
    try {
      res.json(await this.svc.getStock());
    } catch (err) {
      next(err);
    }
  }

  async nearExpiry(req, res, next) {
    try {
      res.json(await this.svc.nearExpiry());
    } catch (err) {
      next(err);
    }
  }

  async lowStock(req, res, next) {
    try {
      res.json(await this.svc.lowStock());
    } catch (err) {
      next(err);
    }
  }

  async getProductBatches(req, res, next) {
    try {
      res.json(await this.svc.getProductBatches(req.params.productId));
    } catch (err) {
      next(err);
    }
  }

  async getBatchDetail(req, res, next) {
    try {
      res.json(await this.svc.getBatchDetail(req.params.batchId));
    } catch (err) {
      next(err);
    }
  }
}
