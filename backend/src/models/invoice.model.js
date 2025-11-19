import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Invoice = sequelize.define("Invoice", {
  
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  invoice_type: {
    type: DataTypes.ENUM("SALES", "PURCHASE"),
    allowNull: false
  },

  // The sales_id or purchase_id
  ref_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Human-readable invoice number (SAL-2025-0001)
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  // Sequential number (increments each invoice)
  sequence_no: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Where the PDF file is saved (optional)
  pdf_path: {
    type: DataTypes.STRING,
    allowNull: true
  },

  printed_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  printed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: "invoices",
  timestamps: true
});
