import { PaymentService } from "../services/payment.service.js";

export class PaymentController {
  constructor() {
    this.svc = new PaymentService();
  }

  async customerPay(req, res, next) {
    try {
      res.status(201).json(await this.svc.customerPay(req.body));
    } catch (err) {
      next(err);
    }
  }

  async supplierPay(req, res, next) {
    try {
      res.status(201).json(await this.svc.supplierPay(req.body));
    } catch (err) {
      next(err);
    }
  }

  async customerLedger(req, res, next) {
    try {
      res.json(await this.svc.customerLedger(req.params.id));
    } catch (err) {
      next(err);
    }
  }

  async supplierLedger(req, res, next) {
    try {
      res.json(await this.svc.supplierLedger(req.params.id));
    } catch (err) {
      next(err);
    }
  }

  async history(req, res, next) {
    try {
      res.json(await this.svc.history());
    } catch (err) {
      next(err);
    }
  }
}
