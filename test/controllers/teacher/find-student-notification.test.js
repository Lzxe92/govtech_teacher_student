var supertest = require('supertest');
var assert = require('chai').assert
const expect = require('chai').expect;
var should = require('chai').should()

beforeEach(async function () {

  await TeacherStudent.destroy({});
  await Student.destroy({});
  await Teacher.destroy({});
});

//populate teacherken@gmail.com and teacherjoe@gmail.com with common and unique student
async function populate() {
  await supertest(sails.hooks.http.app)
    .post('/api/register')
    .send({
      "teacher": "teacherken@gmail.com",
      "students":
        [
          "commonstudent1@gmail.com",
          "commonstudent2@gmail.com",
          "commonstudent3@gmail.com",
          "student_only_under_teacher_ken_1@gmail.com",
          "student_only_under_teacher_ken_2@gmail.com"
        ]
    })
    .expect(204)

  await supertest(sails.hooks.http.app)
    .post('/api/register')
    .send({
      "teacher": "teacherjoe@gmail.com",
      "students":
        [
          "commonstudent1@gmail.com",
          "commonstudent2@gmail.com",
          "commonstudent3@gmail.com",
          "student_only_under_teacher_joe_1@gmail.com",
          "student_only_under_teacher_joe_2@gmail.com"
        ]
    })
    .expect(204)

  await supertest(sails.hooks.http.app)
    .post('/api/suspend')
    .send({
      "student": "commonstudent2@gmail.com"
    })
    .expect(204)

  await supertest(sails.hooks.http.app)
    .post('/api/suspend')
    .send({
      "student": "student_only_under_teacher_joe_2@gmail.com"
    })
    .expect(204)
  await supertest(sails.hooks.http.app)
    .post('/api/suspend')
    .send({
      "student": "student_only_under_teacher_ken_2@gmail.com"
    })
    .expect(204)


}


describe('api/retrievefornotifications', function () {


  describe('Find notification using teacherken@gmail.com, no @mentioned ', function () {
    it('It should return all teacherken@gmail.com student', async function () {
      await populate()

      let response = await supertest(sails.hooks.http.app)
        .post('/api/retrievefornotifications')
        .send({
          "teacher": "teacherken@gmail.com",
          "notification": "Hello students!"
        })
        .expect(200)


      //find existing teacherken@gmail.com tagged students with status = 0
      let teacherKen = await Teacher.findOne({email: "teacherken@gmail.com"}).populate("students", {status: 1})
      let teacherKenExistingStudentsArray = [];
      for(let i = 0 ;i<teacherKen.students.length;i++)
      {
        teacherKenExistingStudentsArray.push(teacherKen.students[i].email);

      }

      //verify that teacherken@gmail.com tagged students with status 0 are returned
      expect(response.body).to.be.an('object')
      let studentEmailArrayResponse = response.body.recipients
      expect(studentEmailArrayResponse).to.be.an('array')
      expect(studentEmailArrayResponse).to.have.members(teacherKenExistingStudentsArray)

    });

  });

  describe('Find notification using teacherken@gmail.com, with @mentioned student of not belong to teacherkeng@gmail.com ', function () {
    it('It should return all teacherken@gmail.com student and the student that was @mentioned in the notification ', async function () {
      await populate()

      let response = await supertest(sails.hooks.http.app)
        .post('/api/retrievefornotifications')
        .send({
          "teacher": "teacherken@gmail.com",
          "notification": "Hello students! @student_only_under_teacher_joe_1@gmail.com @student_only_under_teacher_joe_2@gmail.com"
        })
        .expect(200)


      //find existing teacherken@gmail.com tagged students with status = 0
      let teacherKen = await Teacher.findOne({email: "teacherken@gmail.com"}).populate("students", {status: 1})
      let teacherKenExistingStudentsArray = [];
      for(let i = 0 ;i<teacherKen.students.length;i++)
      {
        teacherKenExistingStudentsArray.push(teacherKen.students[i].email);

      }

      // as student_only_under_teacher_joe_2@gmail.com is suspended, only student_only_under_teacher_joe_1@gmail.com is expected
      let expectedStudentEmailArray= teacherKenExistingStudentsArray;
      expectedStudentEmailArray.push("student_only_under_teacher_joe_1@gmail.com")

      //verify that teacherken@gmail.com tagged students with status 0 are returned
      // and the mentioned students email that are not disabled be returned
      expect(response.body).to.be.an('object')
      let studentEmailArrayResponse = response.body.recipients
      expect(studentEmailArrayResponse).to.be.an('array')
      expect(studentEmailArrayResponse).to.have.members(expectedStudentEmailArray)



    });

  });


});
