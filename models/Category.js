const { Model, DataTypes, INTEGER } = require('sequelize');

const sequelize = require('../config/connection.js');

class Category extends Model {}

Category.init(
  {
    // define columns
    id: {type: DataTpes.INTEGER,
  allowNull: false,
primaryKey: true,
autoIncrement: true
  },
  category_name: {
    type:DataTransfer.Types.STRING,
    allowNull: false
  }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  }
);

module.exports = Category;
