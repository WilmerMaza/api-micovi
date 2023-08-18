/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Countries, conn } = require('../../src/db.js');

const agent = session(app);
const country = {
  Name: 'Argentina',
  ID: 'ARG',
  Continent : 'sur America',
  Capital: 'Buenos Aires',
  Image : 'gsfjkswfjjwnfejw',
  Area : 12.345
};

describe('Country routes', () => {
  beforeAll(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));

  beforeEach(() => Countries.sync({ force: true })
    .then(() => Countries.create(country)));
  describe('GET /countries', () => {
    it('should get 200', () =>{
      agent.get('/countries').expect(200)}
    );
    it('espera que sea html', function(){
      return agent.get('/countries')
        .expect('Content-Type', /json/);
    });
  });
  describe('GET /countries/:ID', () => {
    it('should get 200', () => 

      agent.get('/countries/COL').expect(200)
    )
  })
});
