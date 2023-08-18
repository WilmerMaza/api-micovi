const { Countries, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Country model', () => {
  beforeAll(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Countries.sync({ force: true }));
    describe('name', () => {
      it('should throw an error if name is null', (done) => {
        Countries.create({
            ID: 'COL',
            Continent : 'Colombia',
            Capital: 'COL',
            Image : 'gsfjkswfjjwnfejw',
            Area : 12.345
        })
          .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });
      it('should work when its a valid name', function (done) {
        Countries.create({ Name: 'Argentina' })
        .then(() => done(new Error('It requires a valid name')))
          .catch(() => done());
      });
    });
  });
});
