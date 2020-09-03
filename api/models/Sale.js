/**
 * Sale.js
 *
 * @description ::Represents a Sale
 */

const { DataTypes } = require('sequelize');

module.exports = {
  attributes: {
    total: {
      type: DataTypes.INTEGER
    },
    cancelled_at: {
      type: DataTypes.DATE
    }
  },
  associations: () => {
    Sale.belongsTo(Store, {
      foreignKey: {
        name: 'store_key'
      }
    });
    Sale.belongsTo(Salesman, {
      foreignKey: {
        name: 'salesman_key'
      }
    });
    Sale.hasMany(Ticket, {
      foreignKey: {
        name: 'sale_key'
      }
    });
  },
  options: {
    instanceMethods: {
      getTotal: (optionalTotal) => {
        return optionalTotal || 0;
      }
    }
  }
};
