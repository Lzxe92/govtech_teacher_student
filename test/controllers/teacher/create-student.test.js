var supertest = require('supertest');
var assert = require('chai').assert
const expect = require('chai').expect;
var should = require('chai').should()

beforeEach(async function () {
 //todo repopulate database
  // console.log("aaa");
});
describe('api/register', async function () {

  await describe('Register student(s) with an invalid teacher email', function () {
    it('Should return an error code 404 with an invalid teacher email', function (done) {
      supertest(sails.hooks.http.app)
        .post('/api/register')
        .send({
          "teacher": "teacherkengmail.com",
          "students":
            [
              "studentjon@gmail.com",
              "studenthon@gmail.com"
            ]
        })
        .expect(400, done)
    });

  });

 await describe('Register student(s) with an invalid student email', function () {
    it('Should return an error code 404 with an invalid student email', function (done) {
      supertest(sails.hooks.http.app)
        .post('/api/register')
        .send({
          "teacher": "teacherken@gmail.com",
          "students":
            [
              "studentjongmail.com",
              "studenthon@gmail.com"
            ]
        })
        .expect(400, done)
    });

  });

  await describe('Register student(s) with valid student and teacher email', function () {
    it('It should register a list of student under the teacher email given and return success code 204', async function () {
      requestBody = {
        "teacher": "teacherken@gmail.com",
        "students":
          [
            "studentjon@gmail.com",
            "studenthon@gmail.com"
          ]
      };
      await supertest(sails.hooks.http.app)
        .post('/api/register')
        .send(requestBody)
        .expect(204)

      //check the teacher and students given in the request body are saved into the system
      var teacher = await Teacher.findOne({email: requestBody.teacher});
      expect(teacher.email).to.equal(requestBody.teacher);
      for (let i = 0; i < requestBody.students.length; i++) {
        var student = await Student.findOne({email: requestBody.students[i]});
        expect(student.email).to.equal(requestBody.students[i]);
      }

    });
  });


});
