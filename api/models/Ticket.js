/**
 * Ticket.js
 *
 * @description ::Represents a Ticket
 */

const { DataTypes } = require('sequelize');

module.exports = {
  attributes: {
    seat: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    price: {
      type: DataTypes.INTEGER,
    },
    code: {
      type: DataTypes.INTEGER,
      unique: true
    },
  },
  associations: () => {
    Ticket.belongsTo(Sale, {
      foreignKey: {
        name: 'sale_key',
      }
    });
    Ticket.belongsTo(Passenger, {
      foreignKey: {
        name: 'passenger_key',
      }
    });
    Ticket.hasOne(Discount, {
      as: 'MainDiscount',
      foreignKey: {
        name: 'ticket_key',
        allowNull: false
      }
    });
  }
};
