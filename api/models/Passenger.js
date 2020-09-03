/**
 * Passenger.js
 *
 * @description ::Represents a Passenger
 */

const { DataTypes } = require('sequelize');

module.exports = {
  attributes: {
    name: {
      type: DataTypes.STRING
    },
    is_disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  associations: () => {
    Passenger.hasMany(Ticket, {
      foreignKey: {
        name: 'passenger_key'
      }
    });
  }
};
