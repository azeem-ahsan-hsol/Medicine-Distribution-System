// src/models/product.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    product_name: { type: DataTypes.STRING, allowNull: false },
    generic_name: { type: DataTypes.STRING, allowNull: true },
    strength: { type: DataTypes.STRING, allowNull: true },
    form: { type: DataTypes.STRING, allowNull: true },
    packing: { type: DataTypes.STRING, allowNull: true },
    barcode: { type: DataTypes.STRING, unique: true },
    mrp: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    purchase_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    selling_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    is_prescription_required: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_controlled: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

export default Product;
