/**
 * TeacherStudent.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'teacher_student',
  attributes: {
    updatedAt: false,
    createdAt: false,
    //  id: false,

    teacher: {
      model: 'teacher',
      columnName:'teacher_id'
    },
    student: {
      model: 'student',
      columnName:'student_id'
    },
  },

};

