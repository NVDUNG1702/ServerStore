'use strict';
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Address, DeliveryInfo, Order, FavoriteProduct }) {
      // define association here
      this.hasMany(Address, { foreignKey: 'uid' });
      this.hasMany(DeliveryInfo, { foreignKey: 'uid' });
      this.hasMany(Order, { foreignKey: 'uid' });
      this.hasMany(FavoriteProduct, { foreignKey: 'uid' })
    }

    async validationPassword(pass) {

      try {
        return await bcrypt.compareSync(pass, this.password);
      } catch (error) {
        console.log("error validation pass: ", error);
      }

    }
  }
  User.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      },
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    avatar: {
      type: DataTypes.STRING
    },
    role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};