import { InvoiceService } from "../services/invoice.service.js";

export class InvoiceController {
  constructor() {
    this.svc = new InvoiceService();
  }

  async generateSalesInvoice(req, res, next) {
    try {
      const pdfBuffer = await this.svc.generateSalesInvoice(
        req.params.id,
        req.user.id   // 👈 now sending printed_by
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="sales-invoice-${req.params.id}.pdf"`
      );

      res.end(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }

  async generatePurchaseInvoice(req, res, next) {
    try {
      const pdfBuffer = await this.svc.generatePurchaseInvoice(
        req.params.id,
        req.user.id   // 👈 now sending printed_by
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `inline; filename="purchase-invoice-${req.params.id}.pdf"`
      );

      res.end(pdfBuffer);
    } catch (err) {
      next(err);
    }
  }
}
