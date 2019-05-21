module.exports = {


  friendlyName: 'Find student',


  description: 'Find a student record',


  inputs: {
    studentEmail: {
      type: 'string',
      required: true,
      description: 'The email address of the student',
    },

  },


  exits: {

    success: {
      description: 'All done.',
    },
    studentNotFound: {
      description: 'An student email given was not found in the system',
    },

  },


  fn: async function (inputs,exits) {
    studentEmail = await Student.findOne({email: inputs.studentEmail});
    if (!studentEmail) {
      return exits.studentNotFound({
        message: 'Student with the email ' + inputs.studentEmail + " was not found on the system"
      })
    }else
    {
      return exits.success( studentEmail);

    }
  }


};

