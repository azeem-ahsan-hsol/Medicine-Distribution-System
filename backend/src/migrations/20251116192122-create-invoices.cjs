"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("invoices", {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      invoice_type: {
        type: Sequelize.ENUM("SALES", "PURCHASE"),
        allowNull: false
      },

      ref_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      invoice_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      sequence_no: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      pdf_path: {
        type: Sequelize.STRING,
        allowNull: true
      },

      printed_by: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      printed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("invoices");
  }
};
