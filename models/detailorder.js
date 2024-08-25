'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order }) {
      this.belongsTo(Order, { foreignKey: 'orderID' });
      this.belongsTo(Order, { foreignKey: 'productID' });

      // define association here
    }
  }
  DetailOrder.init({
    orderID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    productID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sizeID: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'DetailOrder',
  });
  return DetailOrder;
};