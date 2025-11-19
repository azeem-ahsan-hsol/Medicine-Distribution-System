'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      customer_id: {
        type: Sequelize.INTEGER,
        references: { model: 'customers', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      invoice_date: Sequelize.DATEONLY,
      discount: Sequelize.DECIMAL(10,2),
      total: Sequelize.DECIMAL(10,2),
      net_total: Sequelize.DECIMAL(10,2),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sales');
  }
};
