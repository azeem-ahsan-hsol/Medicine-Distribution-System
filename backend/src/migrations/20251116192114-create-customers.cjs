'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      license_no: Sequelize.STRING,
      address: Sequelize.STRING,
      phone: Sequelize.STRING,
      credit_limit: { type: Sequelize.DECIMAL(10,2), defaultValue: 0 },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('customers');
  }
};
