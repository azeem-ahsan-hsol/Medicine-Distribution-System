'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      product_name: { type: Sequelize.STRING, allowNull: false },
      generic_name: { type: Sequelize.STRING },
      strength: { type: Sequelize.STRING },
      form: { type: Sequelize.STRING },
      packing: { type: Sequelize.STRING },
      barcode: { type: Sequelize.STRING, unique: true, allowNull: false },
      mrp: { type: Sequelize.DECIMAL(10, 2) },
      purchase_price: { type: Sequelize.DECIMAL(10, 2) },
      selling_price: { type: Sequelize.DECIMAL(10, 2) },
      is_prescription_required: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_controlled: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") 
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP") 
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("products");
  }
};
