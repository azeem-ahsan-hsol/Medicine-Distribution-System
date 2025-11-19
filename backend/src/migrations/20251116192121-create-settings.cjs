"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("settings", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      value: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("settings");
  }
};
