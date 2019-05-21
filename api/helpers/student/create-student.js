module.exports = {


  friendlyName: 'Create a student record',


  description: 'Validate the input email, create the record and return back the record',


  inputs: {
    studentEmail: {
      type: 'string',
     isEmail: true,
      required: true,
      description: 'The email address of the student',
    },

  },


  exits: {

    success: {
      description: 'All done.',
    },
    invalidEmail: {
      description: 'Invalid email address was given.',
    }
  },


  fn: async function (inputs, exits) {

      let studentEmail = await Student.findOrCreate({email: inputs.studentEmail}, {email: inputs.studentEmail});
      return exits.success(studentEmail);


  }


};

