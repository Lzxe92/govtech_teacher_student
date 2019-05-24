/**
 * @api {post} /api/register Register Student under a teacher
 * @apiVersion 0.0.20
 * @apiName PostRegisterStudent
 * @apiGroup Teacher
 * @apiPermission None
 *
 * @apiHeaderExample {json} Headers:
 *   {
 *       "Content-Type": "application/json"
 *   }
 *
 * @apiDescription User Story 1. As a teacher, I want to register one or more students to a specified teacher.<br/>
 * If existing student account does not exists, an account will be created. <br/>
 * If existing teacher account does not exists, an account will be created. <br/>
 * The students will be assosiated under the teacher.
 * It will return a 204 Success status code
 *
 * @apiSuccessExample {json} Success: Account(s) created:
 * HTTP/1.1 204 No Content
 *
 * @apiParamExample {json} Register Student under a teacher
 {
  "teacher": "teacherken@gmail.com",
  "students":
    [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
}
 * @apiErrorExample {json} Error: Teacher email address is not an email:
 *     HTTP/1.1 400 Bad Request
 {
      "code": "E_MISSING_OR_INVALID_PARAMS",
      "problems": [
          "Invalid \"teacher\":\n  · Value ('teacherkengmail.com') was not a valid email address."
      ],
      "message": "The server could not fulfill this request (`POST /api/register`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. "
  }

 * @apiUse    TeacherParameter
 * @apiUse    StudentsArrayParameter
 *
 *
 *

 *
 */

module.exports = {


  friendlyName: 'Register Student under a teacher',
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

    //todo introduce transaction under helper
    // sailjs does not rollback on orm query that was separated into helper,
    //transaction
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
           var teacher=results[0];
           var students=results[1];
            //associate those students into the teacher
            for(let i =0;i<students.length;i++)
            {

              let result = await Teacher.addToCollection(teacher.teacher_id, 'students', students[i])
                .tolerate('E_UNIQUE', (err) => {

              });
            }

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
