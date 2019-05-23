var supertest = require('supertest');
var assert = require('chai').assert
const expect = require('chai').expect;
var should = require('chai').should()

beforeEach((done) => {
  "use strict";
  // Drops database between each test.  This works because we use
  // the memory database
  done()
});


describe('api/suspend', function () {
  describe('Suspend a student with an invalid student email', function () {
    it('Should return an error code 404 as no such student record was found', function (done) {
      supertest(sails.hooks.http.app)
        .post('/api/suspend')
        .send({
          "student": "nosuchstudentemail@gmail.com"
        })
        .expect(404, done)
    });

  });


  describe('Suspend a student with an an valid student email', function () {
    it('Should return an success code 204 with the student status changed to 0', async function () {

      let studentEmail = "studentmary@gmail.com";
      //register an student record first
      await sails.helpers.student.createStudent.with({studentEmail: studentEmail})
      await supertest(sails.hooks.http.app)
        .post('/api/suspend')
        .send({
          "student": studentEmail
        })
        .expect(204)

      //find check if the student status is changed to 0  (suspened)
      let student = await sails.helpers.student.findStudent.with({studentEmail: studentEmail});
      expect(student).to.be.an('object')
      expect(student.email).to.equal(studentEmail);
      expect(student.status).to.equal(0);
    });

  });

});
