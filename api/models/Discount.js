/**
 * Discount.js
 *
 * @description ::Represents a Discount
 */

const { DataTypes } = require('sequelize');

module.exports = {
  attributes: {
    percentage: {
      type: DataTypes.INTEGER
    },
  },
  associations: () => {
    Discount.belongsTo(Ticket, {
      foreignKey: {
        name: 'ticket_key',
        allowNull: false
      }
    });
  }

};
