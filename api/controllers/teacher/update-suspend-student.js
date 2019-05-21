module.exports = {


  friendlyName: 'Suspend student',


  description: 'User story 3. As a teacher, I want to suspend a specified student',


  inputs: {
    student: {
      type: 'string',
      required: true,
      description: 'The email address of the student',
    },

  },


  exits: {
    studentNotFound: {
      description: 'An student email given was not found in the system',
      statusCode: 404,
    },

  },


  fn: async function (inputs,exits,env) {

    //find student from database
    let student = await sails.helpers.teacher.suspendStudent.with({studentEmail:inputs.student})
      .tolerate('studentNotFound', (error)=>{
        return exits.studentNotFound({
          message: 'Student with the email ' + inputs.student + " was not found on the system"
        })

      });

    //return success as a student was suspended
    if(student)
    {
      return env.res.status(204).send();
    }

  }


};
