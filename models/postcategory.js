"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PostCategory.belongsTo(models.Post, { foreignKey: "categoryId" });
      PostCategory.belongsTo(models.Category, { foreignKey: "postId" });
    }
  }
  PostCategory.init(
    {
      postCategoriesId: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      postId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.STRING,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("categoryId");
          return rawValue ? rawValue.split(",") : [];
        },
        set(value) {
          this.setDataValue("categoryId", Array.isArray(value) ? value.join(",") : value);
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "PostCategory",
    }
  );
  return PostCategory;
};
