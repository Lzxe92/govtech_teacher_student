/**
 * Notification.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  primaryKey: "notification_id",
  attributes: {
    updatedAt: false,
    createdAt: false,
    id:false,
    notification_id: {
      type: 'number',
      autoIncrement: true,
      allowNull: false,
    },
    text: {
      type: 'string',
      required: true
    },

  },

};

