/**
 * Teacher.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  primaryKey: "teacher_id",
  attributes: {
    updatedAt: false,
    createdAt: false,
    id:false,
    teacher_id: {
      type: 'number',
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: 'string',
      required: true ,
      unique: true},

    students: {
      collection: 'student',
      via: 'teacher',
      through: 'teacherstudent'
    }
  },

};

