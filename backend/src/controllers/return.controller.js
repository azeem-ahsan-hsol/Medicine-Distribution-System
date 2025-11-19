import { ReturnService } from "../services/return.service.js";

export class ReturnController {
  constructor() {
    this.svc = new ReturnService();
  }

  async createSalesReturn(req, res, next) {
    try {
      // body: { sales_id, customer_id, notes?, items: [{ product_id, sales_item_id?, batch_id?, batch_no?, expiry_date?, quantity, reason? }] }
      const result = await this.svc.createSalesReturn(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getSalesReturns(req, res, next) {
    try {
      res.json(await this.svc.getSalesReturns());
    } catch (err) {
      next(err);
    }
  }

  async createPurchaseReturn(req, res, next) {
    try {
      // body: { purchase_id, supplier_id, notes?, items: [{ product_id, purchase_item_id?, batch_id?, batch_no?, expiry_date?, quantity, reason? }] }
      const result = await this.svc.createPurchaseReturn(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getPurchaseReturns(req, res, next) {
    try {
      res.json(await this.svc.getPurchaseReturns());
    } catch (err) {
      next(err);
    }
  }
}
