module.exports = {


  friendlyName: 'Suspend a student',


  description: 'Suspend a student given the student details',


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


  fn: async function (inputs,exits,env) {

    //find student from database
    let student = await sails.helpers.student.findStudent.with({studentEmail:inputs.studentEmail})
      .tolerate('studentNotFound', (error)=>{
        return exits.studentNotFound({
          message: 'Student with the email ' + inputs.studentEmail + " was not found on the system"
        })

      });

    //student found, suspend it and return it
    if(student)
    {
       student = await Student.update(student).set({status:0}).fetch();
      return exits.success(student);
    }
  }


};

