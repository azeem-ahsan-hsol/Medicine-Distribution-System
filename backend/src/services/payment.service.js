import { BaseService } from "./base.service.js";
import { Payment, Customer, Supplier,Sales,SalesItem,Product, Purchase, PurchaseItem , Batch} from "../models/index.js";

export class PaymentService extends BaseService {
  // -----------------------------------
  // CUSTOMER PAYMENT
  // -----------------------------------
  async customerPay(data) {
    return this.runTransaction(async (t) => {
      const { customer_id, amount, payment_mode, notes } = data;

      const customer = await Customer.findByPk(customer_id, { transaction: t });
      if (!customer) this.error("Customer not found", 404);

      const payment = await Payment.create(
        {
          payment_type: "customer",
          customer_id,
          amount,
          payment_mode,
          notes,
        },
        { transaction: t }
      );

      return this.success("Customer payment recorded", payment);
    });
  }

  // -----------------------------------
  // SUPPLIER PAYMENT
  // -----------------------------------
  async supplierPay(data) {
    return this.runTransaction(async (t) => {
      const { supplier_id, amount, payment_mode, notes } = data;
      if(amount <= 0) {
        this.error("Payment amount must be greater than zero", 400);
      }

      if(payment_mode !== 'cash' && payment_mode !== 'bank_transfer') {
        this.error("Invalid payment mode", 400);
      }

      const supplier = await Supplier.findByPk(supplier_id, { transaction: t });
      if (!supplier) this.error("Supplier not found", 404);

      const payment = await Payment.create(
        {
          payment_type: "supplier",
          supplier_id,
          amount,
          payment_mode,
          notes,
        },
        { transaction: t }
      );

      return this.success("Supplier payment recorded", payment);
    });
  }

  // -----------------------------------
  // CUSTOMER LEDGER
  // -----------------------------------
  async customerLedger(customerId) {
    const payments = await Payment.findAll({
      where: { customer_id: customerId, payment_type: "customer" },
      order: [["createdAt", "ASC"]],
    });

    return this.success("Customer ledger", payments);
  }

  // -----------------------------------
  // SUPPLIER LEDGER
  // -----------------------------------
  async supplierLedger(supplierId) {
    const payments = await Payment.findAll({
      where: { supplier_id: supplierId, payment_type: "supplier" },
      order: [["createdAt", "ASC"]],
    });

    return this.success("Supplier ledger", payments);
  }

  // -----------------------------------
  // FULL PAYMENT HISTORY
  // -----------------------------------
  async history() {
    //include customer for customer payments
    //include supplier for supplier payments
    const payments = await Payment.findAll({
      include: [
        { model: Customer, as: "customer", required: false },
        { model: Supplier, as: "supplier", required: false }
      ],
      order: [["createdAt", "DESC"]],
    }); 

    return this.success("Full payment history", payments);
  }

}
