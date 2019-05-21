module.exports = {


  friendlyName: 'Create students',


  description: 'A teacher helper class, creating student(s)',


  inputs: {
    studentEmailArray: {
      type: 'json',
      required: true,
      description: 'The email address of the student(s)',
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

    invalidEmail: {
      description: 'An invalid email address was given.',
    }
  },

  fn: async function (inputs, exits) {


    // //sequential way of creating the student records
    // for (let i = 0; i < students.length; i++) {
    //   await sails.helpers.student.createStudent.with({student: students[i]});
    //
    // }

    studentEmailArray = [];

    //parallel way of creating the student records
     await Promise.all(inputs.studentEmailArray.map(async (studentEmail) => {
         result = await sails.helpers.student.createStudent.with({studentEmail: studentEmail});
         studentEmailArray.push(result.student_id);
        return result;
      })
      ).then(results => {
        //all success
        return exits.success(studentEmailArray);
      }
      ).catch((error) => {
        if(error.code=="E_INVALID_ARGINS")
        {

        return exits.invalidEmail(error.problems);
        }

      })


  }

};

