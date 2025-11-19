"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // parent returns table
    await queryInterface.createTable("returns", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      // 'sales' or 'purchase'
      return_type: {
        type: Sequelize.ENUM("sales", "purchase"),
        allowNull: false,
      },

      // reference ids (one of these may be null depending on return_type)
      sales_id: {
        type: Sequelize.INTEGER,
        references: { model: "sales", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      purchase_id: {
        type: Sequelize.INTEGER,
        references: { model: "purchases", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
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

      notes: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

    // items for each return
    await queryInterface.createTable("return_items", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      return_id: {
        type: Sequelize.INTEGER,
        references: { model: "returns", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      product_id: {
        type: Sequelize.INTEGER,
        references: { model: "products", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      // if return originates from sales_item or purchase_item you can attach those (optional)
      sales_item_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      purchase_item_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      batch_id: {
        type: Sequelize.INTEGER,
        references: { model: "batches", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },

      batch_no: Sequelize.STRING,
      expiry_date: Sequelize.DATEONLY,
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      reason: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("return_items");
    await queryInterface.dropTable("returns");
  }
};
