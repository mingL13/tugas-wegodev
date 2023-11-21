"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "categoryId", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn("Posts", "deletedAt", {
      allowNull: true,
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Posts", "categoryId");
    await queryInterface.removeColumn("Posts", "deletedAt");
  },
};
