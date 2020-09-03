/**
 * Salesman.js
 *
 * @description ::Represents a Salesman
 */

const { DataTypes } = require('sequelize');

module.exports = {
  attributes: {
    name: {
      type: DataTypes.STRING,
    }
  },
  associations: () => {
    Salesman.belongsToMany(Store, {
      as: 'StoreHired',
      through: 'SalesmanStore',
      foreignKey: 'salesman_id'
    });
  }

};
