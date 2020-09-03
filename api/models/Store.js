/**
 * Store.js
 *
 * @description ::Represents a Store
 */

const { DataTypes } = require('sequelize');

module.exports = {
  attributes: {
    city: {
      type: DataTypes.STRING
    }
  },
  associations: () => {
    Store.belongsToMany(Salesman, {
      through: 'SalesmanStore',
      foreignKey: 'store_id'
    });
  }
};
