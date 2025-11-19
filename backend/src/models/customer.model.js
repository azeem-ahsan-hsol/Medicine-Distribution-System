import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Customer = sequelize.define("Customer", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  license_no: { type: DataTypes.STRING, allowNull: false, unique: true },
  address: DataTypes.STRING,
  phone: DataTypes.STRING,
  credit_limit: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 }
}, { tableName: "customers", timestamps: true });
