import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const SalesItem = sequelize.define("SalesItem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sales_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  batch_id: { type: DataTypes.INTEGER },
  quantity: DataTypes.INTEGER,
  price: DataTypes.DECIMAL(10,2),
  total: DataTypes.DECIMAL(10,2)
}, { tableName: "sales_items", timestamps: true });
