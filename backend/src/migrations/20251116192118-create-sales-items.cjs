'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_items', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      sales_id: {
        type: Sequelize.INTEGER,
        references: { model: 'sales', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: { model: 'products', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      batch_id: {
        type: Sequelize.INTEGER,
        references: { model: 'batches', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      quantity: Sequelize.INTEGER,
      price: Sequelize.DECIMAL(10,2),
      total: Sequelize.DECIMAL(10,2),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sales_items');
  }
};
