import * as chai from 'chai'; // Import Chai for assertions
import chaiHttp, { request } from 'chai-http'; // Import Chai HTTP for API testing
import cleanupDatabase from '../utils/deletemodel.utils.js';
const { expect } = chai; // Use Chai's expect for assertions and request for HTTP requests

chai.use(chaiHttp); // Tell Chai to use Chai HTTP

let Cookie = {};
let P1 = '';


describe('E2E Automated TestCases: 👇', () => {
  //Run before the testcase starts
  before(async (done) => {
    await cleanupDatabase(done); // Clean the database before each test run
  });
  
  it('A1 Authenticated to access the system', (done) => {
    request.execute('http://localhost:3000') // Correct usage of `chai.request`
      .post('/auth/login')
      .send({
        email: 'A1',
        password: 'password',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Login successful');
        Cookie.A1 = res.header['set-cookie'][0];
        done();
      });
  });

  it('P1 authenticates to access the system', (done) => {
    request.execute('http://localhost:3000')
      .post('/auth/login')
      .send({
        email: 'P1',
        password: 'password',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Login successful');
        Cookie.P1 = res.header['set-cookie'][0];
        P1 = res.body.user.id

        done();

      });
  });

  it('P1 Adding TimeSlots ', done => {

    request.execute('http://localhost:3000')
      .post('/appointment/availability')
      .set('Cookie', Cookie.P1)
      .send({
        day: "2024-12-02",
        timeslot: "4:00 AM - 5:00 AM"
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal('Availability added successfully');

      });



   
    request.execute('http://localhost:3000')
      .post('/appointment/availability')
      .set('Cookie', Cookie.P1)
      .send({
        day: "2024-12-03",
        timeslot: "5:00 AM - 6:00 AM"
      })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message).to.equal('Availability added successfully');
        done();
      })
  });

  it('A1 checking available TimeSlot for P1', done => {
    request.execute('http://localhost:3000').post('/appointment/getappointmentsdetails')
      .set('Cookie', Cookie.A1).send({
        professorId: P1
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Appointments fetched successfully');
        done();
      })
  })

  it('A1 book Appointment with P1 for T1', done => {

    request.execute('http://localhost:3000').post('/appointment/bookappointment')
      .set('Cookie', Cookie.A1).send({
        professorId: P1,
        timeslot: '4:00 AM - 5:00 AM',
        date: '2024-12-02'
      }).end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Appointment Booked successfully');
        done();
      })
  })

  it('A2 Authenticates for access', done => {
    request.execute('http://localhost:3000') // Correct usage of `chai.request`
      .post('/auth/login')
      .send({
        email: 'A2',
        password: 'password',
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Login successful');
        Cookie.A2 = res.header['set-cookie'][0];
        done();
      })
  })

  it('A2 books Appointment with P1 for T2', done => {
    request.execute('http://localhost:3000').post('/appointment/bookappointment')
      .set('Cookie', Cookie?.A2).send({
        professorId: P1,
        timeslot: '5:00 AM - 6:00 AM',
        date: '2024-12-03'
      }).end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Appointment Booked successfully');
        done();
      })
  })

  it('P1 cancel Appointment with A1 for T1', done => {
    request.execute('http://localhost:3000').post('/appointment/cancelappointment').set(
      'Cookie',Cookie.P1)
      .send({
        timeslot: '4:00 AM - 5:00 AM',
        date: '2024-12-02'
      }).end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Appointment cancelled successfully');
        done();
      })
  })

  it('A1 checks for pending Appointment', done => {
    request.execute('http://localhost:3000').post('/appointment/getappointmentsdetails')
      .set('Cookie', Cookie.A1)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message).to.equal('Appointments fetched successfully');
        done();
      })
  })
});

