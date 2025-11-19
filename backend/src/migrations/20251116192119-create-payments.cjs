"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payments", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      payment_type: {
        type: Sequelize.ENUM("customer", "supplier"),
        allowNull: false,
      },

      customer_id: {
        type: Sequelize.INTEGER,
        references: { model: "customers", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      supplier_id: {
        type: Sequelize.INTEGER,
        references: { model: "suppliers", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },

      payment_mode: {
        type: Sequelize.ENUM("cash", "bank", "adjustment"),
        defaultValue: "cash",
      },

      notes: Sequelize.STRING,

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("payments");
  },
};
