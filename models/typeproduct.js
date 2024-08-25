'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Product }) {
      // define association here
      this.hasMany(Product, {foreignKey: 'type_id'});
    }
  }
  TypeProduct.init({
    typeName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    detailType: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'TypeProduct',
  });
  return TypeProduct;
};