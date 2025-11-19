import { ReportService } from "../services/report.service.js";

export class ReportController {
  constructor() {
    this.svc = new ReportService();
  }

  salesReport(req, res, next) {
    this.svc.salesReport(req.query).then(res.json.bind(res)).catch(next);
  }

  purchaseReport(req, res, next) {
    this.svc.purchaseReport(req.query).then(res.json.bind(res)).catch(next);
  }

  stockReport(req, res, next) {
    this.svc.stockReport().then(res.json.bind(res)).catch(next);
  }

  nearExpiryReport(req, res, next) {
    this.svc.nearExpiryReport(req.query).then(res.json.bind(res)).catch(next);
  }

  profitLossReport(req, res, next) {
    this.svc.profitLossReport(req.query).then(res.json.bind(res)).catch(next);
  }

  customerLedger(req, res, next) {
    this.svc.customerLedger(req.params.id).then(res.json.bind(res)).catch(next);
  }

  supplierLedger(req, res, next) {
    this.svc.supplierLedger(req.params.id).then(res.json.bind(res)).catch(next);
  }

  dailySummary(req, res, next) {
    this.svc.dailySummary(req.query).then(res.json.bind(res)).catch(next);
  }

  productSales(req, res, next) {
    this.svc.productSales(req.query).then(res.json.bind(res)).catch(next);
  }

  batchStock(req, res, next) {
    this.svc.batchStock(req.params.productId).then(res.json.bind(res)).catch(next);
  }
}
