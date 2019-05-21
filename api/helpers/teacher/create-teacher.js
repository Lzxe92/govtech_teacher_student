module.exports = {


  friendlyName: 'Create teacher',


  description: '',


  inputs: {
    teacherEmail: {
      type: 'string',
      isEmail: true,
      required: true,
      description: 'The email address of the teacher',
    },
  },


  exits: {

    success: {
      description: 'Teacher account created.',
    },

  },


  fn: async function (inputs,exits) {
    //find or create a teacher based on email received
    let teacherEmail = await Teacher.findOrCreate({email:inputs.teacherEmail}, {email:inputs.teacherEmail});
    return exits.success(teacherEmail);
  }


};

