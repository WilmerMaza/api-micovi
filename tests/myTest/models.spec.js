const { conn } = require('../../src/db.js');
const { Countries, TouristActivities } = require('../../src/db.js');
const expect = require('chai').expect;


describe('Model Testing', function () {
    afterAll(async function() {
        await conn.sync({ force: true });
        conn.close();
    })
    describe('Country Model', function() {
        beforeEach(async function() {
            await Countries.sync({ force: true });
        });
        describe('Validations', function() {
            it('error por falta de informacion', function(done) {
                Countries.create({
                    Name : 'Colombia'
                })
                .then(() => done('No deberia crearse'))
                .catch(() => done());
            });
            it('error por falta de informacion', function(done) {
                Countries.create({
                    Name : 'Colombia',
                    ID : 'COL',
                    Capital : 'Bogota'
                })
                .then(() => done('No deberia crearse'))
                .catch(() => done());
            });
            it('error con un dato invalido', function(done) {
                Countries.create({
                  Name: 'Colombia',
                  ID: 'COL',
                  Population: 'MIL'
                })
                .then(() => done('No debería haberse creado'))
                .catch(() => done());
            });
            
        });
        describe('Metodo get', function () {
            it('deberia ser mostrado Area en km2 ', async function() {
              const created = await Countries.create({
                Name: 'Colombia',
                ID: 'COL',
                Continent : 'Colombia',
                Capital: 'COL',
                Image : 'gsfjkswfjjwnfejw',
                Area : 12.345
              })
              expect(created.Area).to.equal('12.345 km2');
            
            });
          });
    });

    describe(' TouristActivities Model', () => {
        beforeEach(() => {
            return TouristActivities.sync({ force: true });
        })
        describe('Validations', () => {
            it('error sin Name', (done) => {
                TouristActivities.create({
                    Difficult : 3,
                    Duration : '3 hours',
                    Season: 'Primavera'
                })
                .then(() => done('No deberia haberse creado'))
                .catch(() => done());
            });
            it('error sin Season', (done) => {
                TouristActivities.create({
                    Name: 'sky',
                    Difficult : 3,
                    Duration : '3 hours',
                    
                })
                .then(() => done('No deberia haberse creado'))
                .catch(() => done());
            });
            it('error por dato invalido', (done) => {
                TouristActivities.create({
                    Name: 'sky',
                    Difficult : 3,
                    Duration : '3 hours',
                    Season: 'noche'
                })
                .then(() => done('No deberia haberse creado'))
                .catch(() => done());
            })
        })
    })


})