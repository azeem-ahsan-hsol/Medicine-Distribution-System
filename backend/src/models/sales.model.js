import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Sales = sequelize.define("Sales", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  customer_id: { type: DataTypes.INTEGER, allowNull: false },
  invoice_date: DataTypes.DATE,
  discount: DataTypes.DECIMAL(10,2),
  total: DataTypes.DECIMAL(10,2),
  net_total: DataTypes.DECIMAL(10,2)
}, { tableName: "sales", timestamps: true });
