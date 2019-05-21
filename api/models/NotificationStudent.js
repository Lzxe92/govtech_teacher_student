/**
 * NotificationStudent.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'notification_student',

  attributes: {
    updatedAt: false,
    createdAt: false,
    //  id: false,

    notification_id: {
      model: 'notification',
    },
    student_id: {
      model: 'student',
    },
  },

};

