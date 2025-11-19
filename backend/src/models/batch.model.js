import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Batch = sequelize.define("Batch", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  batch_no: DataTypes.STRING,
  mfg_date: DataTypes.DATE,
  expiry_date: DataTypes.DATE,
  quantity: DataTypes.INTEGER,
  purchase_price: DataTypes.DECIMAL(10,2)
}, { tableName: "batches", timestamps: true });
