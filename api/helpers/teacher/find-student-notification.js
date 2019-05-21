module.exports = {


  friendlyName: 'Find student notification',


  description: '',


  inputs: {
    teacherEmail: {
      type: 'string',
      required: true,
      isEmail: true,
      description: 'The email address of the teacher',
    },
    studentEmailArray: {
      type: 'json',
      required: true,
      description: 'The email address of the student',
      isNotEmptyString: true,
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },
    teacherNotFound: {
      description: 'An teacher email given was not found in the system',
    },
  },


  fn: async function (inputs, exits) {
    //validate teacher email


    teacher = await Teacher.findOne({email: inputs.teacherEmail});
    if (!teacher) {
      return exits.teacherNotFound({
        message: 'Teacher with the email ' + inputs.teacherEmail + " was not found on the system"
      })
    } else


    // SAILJS WATERLINE  ORM TOO IMATURE(Or rather too flexible), HAVE TO RESORT INTO RAW QUERY
      var query = `(select student.email from student inner join teacher_student on student.student_id=teacher_student.student_id
    where teacher_student.teacher_id=$1  and student.status=1)`;

    if (inputs.studentEmailArray.length > 0) {
      query += `union (select student.email from student where student.email in ($2) and student.status=1 )`;

    }


    let studentEmailArray = [];
    let rawResult = await sails.sendNativeQuery(query, [teacher.teacher_id, inputs.studentEmailArray]);
    for (let i = 0, len = rawResult.rows.length; i < len; i++) {
      studentEmailArray.push(rawResult.rows[i].email);
    }
    return exits.success(studentEmailArray);


  }


};

