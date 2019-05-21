/**
 * Student.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  primaryKey: "student_id",
  attributes: {
    updatedAt: false,
    createdAt: false,
    id:false,
    student_id: {
      type: 'number',
      autoIncrement: true,
      allowNull: false,
    },
    status: {
      type: 'number',
      allowNull: false,
      columnType: 'tinyint(1)',
      defaultsTo: 1
    },
    email: {
      type: 'string',
      required: true ,
      unique: true
    },
    teacher:{
      collection: 'teacher',
      via: 'student',
      through: 'teacherstudent'
    }
  },

};

