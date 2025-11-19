import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ReturnItem = sequelize.define(
  "ReturnItem",
  {
    return_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    sales_item_id: DataTypes.INTEGER,
    purchase_item_id: DataTypes.INTEGER,
    batch_id: DataTypes.INTEGER,
    batch_no: DataTypes.STRING,
    expiry_date: DataTypes.DATEONLY,
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    reason: DataTypes.STRING
  },
  { tableName: "return_items" }
);
