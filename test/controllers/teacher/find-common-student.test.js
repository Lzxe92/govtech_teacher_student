var supertest = require('supertest');
var assert = require('chai').assert
const expect = require('chai').expect;
var should = require('chai').should()

beforeEach((done) => {
  done()
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
          "student_only_under_teacher_ken@gmail.com"
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
          "student_only_under_teacher_joe@gmail.com"
        ]
    })
    .expect(204)

}


describe('api/commonstudents', function () {
  describe('Find common student under teacherken@gmail.com ', function () {
    it('It should return an array of common student email under teacherken@gmail.com', async function () {
      await populate()

      let response = await supertest(sails.hooks.http.app)
        .get('/api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com')
        .expect(200)
      let studentEmailArray=response.body
      expect(studentEmailArray).to.be.an('object')
      expect(studentEmailArray.students).to.be.an('array')
      expect(studentEmailArray.students).to.have.lengthOf(2)
      expect(studentEmailArray.students).to.have.members([
        "commonstudent1@gmail.com",
        "commonstudent2@gmail.com"
      ])

    });

  });

  describe('Find common student under under teacherken@gmail.com and teacherong@gmail.com ', function () {
    it('It should return an array of student email under teacherken@gmail.com and teacherong@gmail.com', async function () {
      await populate()

      let response = await supertest(sails.hooks.http.app)
        .get('/api/commonstudents?teacher=teacherken%40gmail.com')
        .expect(200)
      let studentEmailArray=response.body
      expect(studentEmailArray).to.be.an('object')
      expect(studentEmailArray.students).to.be.an('array')
      expect(studentEmailArray.students).to.have.lengthOf(3)
      expect(studentEmailArray.students).to.have.members([
        "commonstudent1@gmail.com",
        "commonstudent2@gmail.com",
        "student_only_under_teacher_ken@gmail.com"
      ])

    });

  });

});
