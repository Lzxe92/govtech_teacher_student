module.exports = {


  friendlyName: 'Register Student under the teacher',
  description: 'User Story 1. As a teacher, I want to register one or more students to a specified teacher.',

  inputs: {
    teacher: {
      type: 'string',
      isEmail: true,
      required: true,
      description: 'The email address of the teacher',
    },
    students: {
      type: 'json',
      isNotEmptyString:true,
      columnType: 'array',
      required: true,
      description: 'The email address of the student(s)',
    },
  },


  exits: {
    studentEmpty: {
      description: 'No student email was given in the array, 400 due to bad syntax',
      statusCode: 400,
    },
    duplicateStudent: {
      description: 'One of the student was already registered to the teacher',
      statusCode: 400,
    }
    , invalidEmail: {
      description: 'Invalid email address was given.',
      statusCode: 400,
    }
  },


  fn: async function (inputs, exits, env) {

    //convert single student input scenario into array of students
    if (Array.isArray(inputs.students)) {
      studentEmailArray = inputs.students;
    } else {
      studentEmailArray = [];
      studentEmailArray.push(inputs.students)

    }

    //input validation check empty student array
    if (studentEmailArray.length == 0) {
      return exits.studentEmpty({
        message: 'Students array is empty'
      })

    }else
    { //remove duplicate students email

      let set = new Set(studentEmailArray);
      studentEmailArray=Array.from(set);
    }


    //transaction todo introduce transaction under helper
    await sails.getDatastore()
      .transaction(async (db) => {
        //run the query below in parallel, get the result of those query and assign them into the variable
         await Promise.all([

            //create/find teacher record
            sails.helpers.teacher.createTeacher.with({teacherEmail: inputs.teacher}),
            //create/find students record
           sails.helpers.teacher.createStudents.with({studentEmailArray: studentEmailArray})
          ]
        ).then(async results => {
           let duplicateStudent = false;
            //associate those students into the teacher
           let result = await Teacher.addToCollection(results[0].teacher_id, 'students', results[1])
            // Duplicate student ID on the system
              .tolerate('E_UNIQUE', (err) => {
                duplicateStudent = true;
                return exits.duplicateStudent({
                  message: 'One of the student was already registered to the teacher'
                });
              });

            if (!duplicateStudent)
              return env.res.status(204).send();

          }
        ).catch((error) => {
          if (error.code == "invalidEmail")
          {
            return exits.invalidEmail({message:error.raw[0]});

          }else
          {return env.res.serverError({message:error.message});
          }
        });

      });


  }


};
