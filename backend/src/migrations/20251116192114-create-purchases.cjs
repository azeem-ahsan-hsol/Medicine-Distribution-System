'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('purchases', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      supplier_id: {
        type: Sequelize.INTEGER,
        references: { model: 'suppliers', key: 'id' },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
      },
      invoice_no: Sequelize.STRING,
      invoice_date: Sequelize.DATEONLY,
      total_amount: Sequelize.DECIMAL(10,2),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('purchases');
  }
};
