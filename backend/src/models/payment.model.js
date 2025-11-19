import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Payment = sequelize.define(
  "Payment",
  {
    payment_type: {
      type: DataTypes.ENUM("customer", "supplier"),
      allowNull: false,
    },
    customer_id: DataTypes.INTEGER,
    supplier_id: DataTypes.INTEGER,
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment_mode: {
      type: DataTypes.ENUM("cash", "bank", "adjustment"),
      defaultValue: "cash",
    },
    notes: DataTypes.STRING,
  },
  { tableName: "payments" }
);
