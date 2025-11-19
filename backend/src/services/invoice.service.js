import puppeteer from "puppeteer";
import {
  Sales,
  SalesItem,
  Product,
  Batch,
  Purchase,
  PurchaseItem,
  Customer,
  Supplier,
  Setting,
  Invoice
} from "../models/index.js";
import { BaseService } from "./base.service.js";
import { buildInvoiceHTML } from "../templates/invoice.template.js";

// Generate unique invoice number
const generateInvoiceNumber = async (type) => {
  const prefix = type === "SALES" ? "SAL" : "PUR";

  const last = await Invoice.findOne({
    where: { invoice_type: type },
    order: [["sequence_no", "DESC"]],
  });

  const nextSeq = last ? last.sequence_no + 1 : 1;

  const seqPadded = String(nextSeq).padStart(4, "0");
  const year = new Date().getFullYear();

  return {
    invoice_number: `${prefix}-${year}-${seqPadded}`,
    sequence_no: nextSeq
  };
};

export class InvoiceService extends BaseService {

  // ======================
  // SALES INVOICE
  // ======================
  async generateSalesInvoice(id, printedBy) {
    try {
      const settings = await Setting.findOne();
      const sales = await Sales.findByPk(id);

      if (!sales) this.error("Sales invoice not found", 404);

      const customer = await Customer.findByPk(sales.customer_id);

      let items = await SalesItem.findAll({ where: { sales_id: id } });

      for (let item of items) {
        const batch = await Batch.findByPk(item.batch_id);
        item.batch = batch;

        if (batch) {
          const product = await Product.findByPk(batch.product_id);
          item.product = product;
        } else {
          item.product = null;
        }
      }

      const { invoice_number, sequence_no } = await generateInvoiceNumber("SALES");

      const html = buildInvoiceHTML({
        type: "SALES",
        settings,
        invoice: { ...sales.dataValues, customer },
        items,
        invoiceNumber: invoice_number
      });

      const pdf = await this.generatePDF(html);

      await Invoice.create({
        invoice_type: "SALES",
        ref_id: id,
        invoice_number,
        sequence_no,
        printed_at: new Date(),
        printed_by: printedBy,   // 👈 DYNAMIC USER ID
        pdf_path: null
      });

      return pdf;

    } catch (err) {
      this.error(err.message || "Failed to generate sales invoice", 500);
    }
  }

  // ======================
// PURCHASE INVOICE
// ======================
  async generatePurchaseInvoice(id, printedBy) {
    try {
      const settings = await Setting.findOne();
      const purchase = await Purchase.findByPk(id);

      if (!purchase) this.error("Purchase invoice not found", 404);

      const supplier = await Supplier.findByPk(purchase.supplier_id);

      // Load items manually
      let items = await PurchaseItem.findAll({ where: { purchase_id: id } });

      let subTotal = 0;

      for (let item of items) {
        const product = await Product.findByPk(item.product_id);
        item.product = product;

        // Correct fields
        item.rate = Number(item.cost_price) || 0;
        item.item_total = Number(item.quantity) * item.rate;

        // Sum subtotal
        subTotal += item.item_total;
      }

      // PURCHASE NET TOTAL = subtotal (no discount on purchase)
      purchase.subTotal = subTotal;
      purchase.netTotal = subTotal;

      const { invoice_number, sequence_no } =
        await generateInvoiceNumber("PURCHASE");

      const html = buildInvoiceHTML({
        type: "PURCHASE",
        settings,
        invoice: { 
          ...purchase.dataValues,
          supplier,
          total: subTotal,
          net_total: subTotal,
          discount: 0 // purchase has no discount
        },
        items,
        invoiceNumber: invoice_number
      });

      const pdf = await this.generatePDF(html);

      await Invoice.create({
        invoice_type: "PURCHASE",
        ref_id: id,
        invoice_number,
        sequence_no,
        printed_at: new Date(),
        printed_by: printedBy,
        pdf_path: null
      });

      return pdf;

    } catch (err) {
      this.error(err.message || "Failed to generate purchase invoice", 500);
    }
  }




  // ======================
  // GENERATE PDF
  // ======================
  async generatePDF(html) {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" }
    });

    await browser.close();
    return pdf;
  }
}
