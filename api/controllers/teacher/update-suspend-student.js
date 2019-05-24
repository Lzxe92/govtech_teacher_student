/**
 * @api {post} /api/retrievefornotifications Suspend a student
 * @apiVersion 0.0.20
 * @apiName PostSuspendStudent
 * @apiGroup Teacher
 * @apiPermission None
 *
 * @apiHeaderExample {json} Headers:
 *   {
 *       "Content-Type": "application/json"
 *   }
 *
 * @apiDescription User story 3. As a teacher, I want to suspend a specified student.<br/>
 * Suspend the student, change the status of the student from 1 to 0
 *
 * @apiSuccessExample {json} Success: Student Suspend:
 * HTTP/1.1 204 No content
 * @apiParamExample {json} Suspend a student
 {
  "student":  "studenthon@gmail.com"
}
 * @apiParam {String} student  Student email address
 * @apiErrorExample {json} Error: Student does not exists on the system:
 *     HTTP/1.1 404 Not Found
 *
 {
    "message": "Student with the email unknownstudentemail@gmail.com was not found on the system"
 }
 *
 *
 *

 *
 */
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


  fn: async function (inputs, exits, env) {

    //find student from database
    let student = await sails.helpers.teacher.suspendStudent.with({studentEmail: inputs.student})
      .tolerate('studentNotFound', (error) => {
        return exits.studentNotFound({
          message: 'Student with the email ' + inputs.student + " was not found on the system"
        })

      });

    //return success as a student was suspended
    if (student) {
      return env.res.status(204).send();
    }

  }


};
