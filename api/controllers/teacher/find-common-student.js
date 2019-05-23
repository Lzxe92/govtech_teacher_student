module.exports = {

  friendlyName: 'Find common student(s) using a list of teacher',
  description: 'User Story 2. As a teacher, I want to retrieve a list of students common to a given list of teachers (i.e. retrieve students who are registered to ALL of the given teachers).',

  inputs: {
    teacher: {
      type: 'json',
      required: true,
      isNotEmptyString: true,
      description: 'The email address of the teacher(s)',
    }
  },


  exits: {
    teacherEmpty: {
      description: 'No teacher email was given in the array, 400 due to bad syntax ',
      statusCode: 400,
    },
    teacherNotFound: {
      description: 'An teacher email given in the array was not found in the system',
      statusCode: 400,
    },
  },


  fn: async function (inputs, exits, env) {

    //convert single teacher input scenario into array of teachers
    if (Array.isArray(inputs.teacher)) {
      var teacherEmailArray = inputs.teacher;
    } else {
      teacherEmailArray = [];
      teacherEmailArray.push(inputs.teacher)
    }

    //input validation check empty teacher array
    if (teacherEmailArray == 0) {
      return exits.teacherEmpty({
        message: 'Teacher array is empty'
      })
    } else { //remove duplicate teachers

      let set = new Set(teacherEmailArray);
      teacherEmailArray = Array.from(set);
    }

    let teacherIDArray = [];
    //handle one or two input

    //sequential way of finding the teachers records using teacher email, break if a teacher was not found
    for (let i = 0; i < teacherEmailArray.length; i++) {
      teacher = await Teacher.findOne({email: teacherEmailArray[i]});
      if (!teacher) {
        return exits.teacherNotFound({
          message: 'Teacher with the email ' + teacherEmailArray[i] + " was not found on the system"
        })
      }
      teacherIDArray.push(teacher.teacher_id);
    }

    if (teacherIDArray.length > 0) {
      // SAILJS WATERLINE  ORM TOO IMATURE(Or rather too flexible), HAVE TO RESORT INTO RAW QUERY
      let query = `select DISTINCT (student.email) from student inner join teacher_student on student.student_id=teacher_student.student_id 
          where teacher_student.teacher_id in ($1)
          group by student.student_id
          having count( student.student_id) = $2`;

      let commonStudent = [];
      let rawResult = await sails.sendNativeQuery(query, [teacherIDArray, teacherIDArray.length]);
      for (let i = 0, len = rawResult.rows.length; i < len; i++) {
        commonStudent.push(rawResult.rows[i].email);
      }
      return env.res.send({students: commonStudent});
    }


    return;

  }


};
