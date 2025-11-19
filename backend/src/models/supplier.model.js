import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Supplier = sequelize.define("Supplier", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }, // <- unique
  gst_no: { type: DataTypes.STRING, unique: true },
  address: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING
}, { tableName: "suppliers", timestamps: true });
