'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ SizeProduct, TypeProduct, DetailOrder, FavoriteProduct }) {
      // define association here
      this.hasMany(SizeProduct, { foreignKey: 'id_product' });
      this.belongsTo(TypeProduct, { foreignKey: 'type_id' });
      this.hasMany(DetailOrder, { foreignKey: 'productID' });
      this.hasMany(FavoriteProduct, {foreignKey: 'productID'})
    }
  }

  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    image: {
      type: DataTypes.JSON,
      allowNull: false
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};