import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Return = sequelize.define(
  "Return",
  {
    return_type: {
      type: DataTypes.ENUM("sales", "purchase"),
      allowNull: false
    },
    sales_id: DataTypes.INTEGER,
    purchase_id: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER,
    supplier_id: DataTypes.INTEGER,
    notes: DataTypes.STRING
  },
  { tableName: "returns" }
);
