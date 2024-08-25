'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, DetailOrder, DeliveryInfo }) {
      this.belongsTo(User, { foreignKey: 'uid' });
      this.hasMany(DetailOrder, { foreignKey: 'orderID' });
      this.belongsTo(DeliveryInfo, {foreignKey: 'infoID'})
      // define association here

    }
  }
  Order.init({
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    time: {
      type: DataTypes.DATE,
    },
    infoID: {
      type: DataTypes.INTEGER,
    },
    detail: DataTypes.TEXT,
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};