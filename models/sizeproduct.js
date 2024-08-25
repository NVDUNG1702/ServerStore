'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SizeProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Product, DetailOrder }) {
      // define association here
      this.belongsTo(Product, { foreignKey: 'id_product' });
      this.hasMany(DetailOrder, { foreignKey: 'sizeID' });
    }
  }
  SizeProduct.init({
    sizeName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    detailSize: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_product: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'SizeProduct',
  });
  return SizeProduct;
};