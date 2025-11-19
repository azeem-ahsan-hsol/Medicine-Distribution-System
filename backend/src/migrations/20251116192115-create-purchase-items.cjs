'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchase_items', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      purchase_id: {
        type: Sequelize.INTEGER,
        references: { model: 'purchases', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: { model: 'products', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      batch_no: Sequelize.STRING,
      expiry_date: Sequelize.DATEONLY,
      quantity: Sequelize.INTEGER,
      free_qty: { type: Sequelize.INTEGER, defaultValue: 0 },
      cost_price: Sequelize.DECIMAL(10,2),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('purchase_items');
  }
};
