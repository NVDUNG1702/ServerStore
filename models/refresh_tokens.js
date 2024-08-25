'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Refresh_tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Refresh_tokens.init({
    token: DataTypes.STRING,
    uid: DataTypes.INTEGER,
    expiresAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Refresh_tokens',
  });
  return Refresh_tokens;
};