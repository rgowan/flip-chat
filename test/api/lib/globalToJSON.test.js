require('../helper');

const globalToJSON  = require('../../../lib/globalToJSON');
const User          = require('../../../models/user');

describe('globalToJSON', () => {
  beforeEach(done => {
    User.collection.remove();
    done();
  });

  afterEach(done => {
    User.collection.remove();
    done();
  });

  it('should be function', done => {
    expect(globalToJSON).to.be.a('function');
    done();
  });

  describe('testing JSON output', () => {
    let token    = null;
    let testUser = null;

    beforeEach(done => {
      api
        .post('/api/register')
        .set('Accept', 'application/json')
        .send({
          first: 'test',
          last: 'test',
          image: 'http://www.fillmurray.com/300/300',
          email: 'test@test.com',
          password: 'password',
          passwordConfirmation: 'password'
        })
        .end((err, res) => {
          token    = res.body.token;
          testUser = res.body.user;
          done();
        });
    });

    it('should return user json data without _id, __v, password, passwordConfrimation', done => {
      api
        .get(`/api/users/${testUser.id}`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res.body)
            .and.have.all.keys([
              '_id',
              'id',
              'first',
              'last',
              'fullname',
              'online',
              'image',
              'email',
              'createdAt',
              'updatedAt'
            ]);
          done();
        });
    });
  });
});