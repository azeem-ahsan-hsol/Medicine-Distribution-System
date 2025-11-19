import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Setting = sequelize.define(
  "Setting",
  {
    key: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    value: {
      type: DataTypes.TEXT
    }
  },
  { tableName: "settings" }
);
