module.exports = {


  friendlyName: 'Find student notification',


  description: 'User Story 4. As a teacher, I want to retrieve a list of students who can receive a given notification. ',
  inputs: {
    teacher: {
      type: 'string',
      required: true,
      isEmail: true,
      description: 'The email address of the teacher',
    },
    notification: {
      type: 'string',
      required: true,
      description: 'The notification text',
    },
  },


  exits: {
    teacherNotFound: {
      description: 'An teacher email given was not found in the system',
      statusCode: 400,
    },
    studentNotFound: {
      description: 'An student email given in the array was not found in the system',
      statusCode: 400,
    },
  },


  fn: async function (inputs, exits, env) {

    //assume each email start with @ and were splitted by empty space
    //add those email into a set to remove duplicates
    let notificationText = inputs.notification.split(' ');
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let studentEmailSet = new Set();
    for (let i = 0; i < notificationText.length; i++) {
      if (notificationText[i].charAt(0) == "@" && emailRegexp.test(notificationText[i].substr(1))) {
        studentEmailSet.add(notificationText[i].substr(1));
      }
    }
    let studentEmailArray = Array.from(studentEmailSet)
    let studentEmail = await sails.helpers.teacher.findStudentNotification.with({
      teacherEmail: inputs.teacher,
      studentEmailArray: studentEmailArray
    })
      .tolerate('teacherNotFound', (error) => {
        return exits.teacherNotFound({
          message: 'Teacher with the email ' + inputs.teacher + " was not found on the system"
        })

      });


    if (studentEmail)
      return env.res.send({recipients: studentEmail});

  }


};
