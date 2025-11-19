import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

import { User } from "./user.model.js";
import { Product } from "./product.model.js";
import { Supplier } from "./supplier.model.js";
import { Customer } from "./customer.model.js";
import { Purchase } from "./purchase.model.js";
import { PurchaseItem } from "./purchaseItem.model.js";
import { Sales } from "./sales.model.js";
import { SalesItem } from "./salesItem.model.js";
import { Batch } from "./batch.model.js";
import { Payment } from "./payment.model.js";
import { Return } from "./return.model.js";
import { ReturnItem } from "./returnItem.model.js";
import { Setting } from "./setting.model.js";
import { Invoice } from "./invoice.model.js";

const db = {
  sequelize,
  User,
  Product,
  Supplier,
  Customer,
  Purchase,
  PurchaseItem,
  Sales,
  SalesItem,
  Batch,
  Payment,
  Return,
  ReturnItem,
  Setting,
  Invoice,
};

// ==================== Associations ==================== //

// --- Purchases & Supplier ---
Purchase.belongsTo(Supplier, { foreignKey: "supplier_id", as: "supplier" });
Supplier.hasMany(Purchase, { foreignKey: "supplier_id", as: "purchases" });

// --- Purchase & PurchaseItems ---
Purchase.hasMany(PurchaseItem, { foreignKey: "purchase_id", onDelete: "CASCADE", as: "items" });
PurchaseItem.belongsTo(Purchase, { foreignKey: "purchase_id", as: "purchase" });

// --- Product ↔ PurchaseItem ---
Product.hasMany(PurchaseItem, { foreignKey: "product_id", onDelete: "CASCADE", as: "purchase_items" });
PurchaseItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// --- Sales ↔ Customer ---
Sales.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });
Customer.hasMany(Sales, { foreignKey: "customer_id", as: "sales" });

// --- Sales ↔ SalesItems ---
Sales.hasMany(SalesItem, { foreignKey: "sales_id", onDelete: "CASCADE", as: "items" });
SalesItem.belongsTo(Sales, { foreignKey: "sales_id", as: "sale" });

// --- SalesItem ↔ Product & Batch ---
SalesItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Product.hasMany(SalesItem, { foreignKey: "product_id", as: "sales_items" });

SalesItem.belongsTo(Batch, { foreignKey: "batch_id", as: "batch" });
Batch.hasMany(SalesItem, { foreignKey: "batch_id", as: "sales_items" });

// --- Product ↔ Batch ---
Product.hasMany(Batch, { foreignKey: "product_id", onDelete: "CASCADE", as: "batches" });
Batch.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// --- Customer ↔ Payment ---
Customer.hasMany(Payment, { foreignKey: "customer_id", as: "payments" });
Payment.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });

// --- Supplier ↔ Payment ---
Supplier.hasMany(Payment, { foreignKey: "supplier_id", as: "payments" });
Payment.belongsTo(Supplier, { foreignKey: "supplier_id", as: "supplier" });

// --- Return ↔ ReturnItem ---
Return.hasMany(ReturnItem, { foreignKey: "return_id", onDelete: "CASCADE", as: "items" });
ReturnItem.belongsTo(Return, { foreignKey: "return_id", as: "return" });

// --- Purchase & Return ---
Purchase.hasMany(Return, { foreignKey: "purchase_id", as: "returns" });
Return.belongsTo(Purchase, { foreignKey: "purchase_id", as: "purchase" });

// --- Sales & Return ---
Sales.hasMany(Return, { foreignKey: "sales_id", as: "returns" });
Return.belongsTo(Sales, { foreignKey: "sales_id", as: "sale" });

// --- Customer & Return ---
Customer.hasMany(Return, { foreignKey: "customer_id", as: "returns" });
Return.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });

// --- Supplier & Return ---
Supplier.hasMany(Return, { foreignKey: "supplier_id", as: "returns" });
Return.belongsTo(Supplier, { foreignKey: "supplier_id", as: "supplier" });

// --- ReturnItem ↔ Product & Batch ---
ReturnItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });
ReturnItem.belongsTo(Batch, { foreignKey: "batch_id", as: "batch" });

// ============ Invoice Associations ============ //
Invoice.belongsTo(Sales, {
  foreignKey: "ref_id",
  constraints: false,
  as: "sales_invoice"
});

Invoice.belongsTo(Purchase, {
  foreignKey: "ref_id",
  constraints: false,
  as: "purchase_invoice"
});


// ====================================================== //

export default db;

export {
  sequelize,
  User,
  Product,
  Supplier,
  Customer,
  Purchase,
  PurchaseItem,
  Sales,
  SalesItem,
  Batch,
  Setting,
  Payment,
  Return,
  ReturnItem,
  Invoice,
};
