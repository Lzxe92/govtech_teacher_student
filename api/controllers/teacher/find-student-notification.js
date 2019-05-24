/**
 * @api {post} /api/retrievefornotifications Find student notification
 * @apiVersion 0.0.20
 * @apiName PostFindStudentNotification
 * @apiGroup Teacher
 * @apiPermission None
 *
 * @apiHeaderExample {json} Headers:
 *   {
 *       "Content-Type": "application/json"
 *   }
 *
 * @apiDescription User Story 4. As a teacher, I want to retrieve a list of students who can receive a given notification.<br/>
 * The student returned must fulfill the following criteria <br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;MUST NOT be suspended <br/>
 * &nbsp;&nbsp;&nbsp;&nbsp;is registered with “teacherken@gmail.com" (the input teacher email)<br />
 * &nbsp;&nbsp;&nbsp;&nbsp;has been @mentioned in the notification<br />
 * If no student email was @mentioned at notification, it will only retrieve all students associated by the teacher
 *
 * @apiSuccessExample {json} Success: Recipients returned with @mentioned used:
 * HTTP/1.1 200 Success
 {
  "recipients":
    [
      "studentbob@gmail.com",
      "studentagnes@gmail.com",
      "studentmiche@gmail.com"
    ]
 }
 * @apiSuccess {Array}   recipients   Array of student(s) email
 * @apiSuccessExample {json} Success: Recipients returned without @mentioned used:
 * HTTP/1.1 200 Success
 {
  "recipients":
    [
      "studentbob@gmail.com"
    ]
}
 * @apiParamExample {json} Find Notification with @mentioned
 {
  "teacher":  "teacherken@gmail.com",
  "notification": "Hey everybody"
}
 * @apiParamExample {json} Find Notification without @mentioned
 {
  "teacher":  "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
 }
 * @apiUse    TeacherParameter
 * @apiParam {Json} notification  Text with email address of students to include in the notification. Syntax of those email should be @user@email.com followed with a space
 * @apiErrorExample {json} Error: Teacher email address is not an valid email address:
 *     HTTP/1.1 400 Bad Request
 *
 {
      "code": "E_MISSING_OR_INVALID_PARAMS",
      "problems": [
          "Invalid \"teacher\":\n  · Value ('teacherkengmail.com') was not a valid email address."
      ],
      "message": "The server could not fulfill this request (`POST /api/register`) due to 1 missing or invalid parameter.  **The following additional tip will not be shown in production**:  Tip: Check your client-side code to make sure that the request data it sends matches the expectations of the corresponding parameters in your server-side route/action.  Also check that your client-side code sends data for every required parameter.  Finally, for programmatically-parseable details about each validation error, `.problems`. "
  }
 *
 *
 *

 *
 */
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
