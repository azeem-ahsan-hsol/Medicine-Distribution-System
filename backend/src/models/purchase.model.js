import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Supplier } from "./supplier.model.js";

export const Purchase = sequelize.define("Purchase", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  supplier_id: { type: DataTypes.INTEGER, allowNull: false },
  invoice_no: DataTypes.STRING,
  invoice_date: DataTypes.DATE,
  total_amount: DataTypes.DECIMAL(10,2)
}, { tableName: "purchases", timestamps: true });
