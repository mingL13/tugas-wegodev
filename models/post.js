"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.Category, { foreignKey: "categoryId" });
    }
  }
  Post.init(
    {
      postId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("Published", "Unpublished"),
        allowNull: false,
        defaultValue: "Published",
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
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
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    },
    {
      sequelize,
      paranoid: true,
      modelName: "Post",
    }
  );
  return Post;
};
