import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Product } from "./product.model.js";
import { Purchase } from "./purchase.model.js";

export const PurchaseItem = sequelize.define("PurchaseItem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  purchase_id: { type: DataTypes.INTEGER, allowNull: false },
  product_id: { type: DataTypes.INTEGER, allowNull: false },
  batch_no: DataTypes.STRING,
  expiry_date: DataTypes.DATE,
  quantity: DataTypes.INTEGER,
  free_qty: DataTypes.INTEGER,
  cost_price: DataTypes.DECIMAL(10,2)
}, { tableName: "purchase_items", timestamps: true });
