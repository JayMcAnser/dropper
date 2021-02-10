const chai = require('chai');
const chaiHttp = require('chai-http'); //types');
chai.use(chaiHttp);
const assert = chai.assert;

// must run init first because it load the wrong definition
const Init = require('./init-test');
const Board = require('../models/board')
const Const = require('../vendors/lib/const');
const TEST_BOARD = 'test.ctrl'
const server = 'http://localhost:3050/api';


describe('controller.board', () => {

  let TEST_BOARD_ID = 0;

  describe('with login', () => {
    let token;
    before( async() => {
      token = await Init.AuthToken;
      let session = {userId: await Init.AuthUserId};
      // must use ROOT_USER because we logged in as a new user
      await Board.delete({userId: Board.ROOT_USER}, TEST_BOARD)
    })

    it('create', () => {
      return chai.request(server)
        .post('/board')
        .set('authorization', token)
        // .type('form')
        .send({name: TEST_BOARD, title:'Test Board'})
        .then((result) => {
          assert.equal(result.status, 200);
          assert.isUndefined(result.body.errors)
          // assert.equal(result.body.status, Const.status.success, result.body.message);
          TEST_BOARD_ID = result.body.data
        })
    })

    it('open', () => {
      return chai.request(server)
        .get(`/board/${TEST_BOARD}`)
        .set('authorization', token)
        .then((result) => {
          assert.equal(result.status, 200)
          assert.isDefined(result.body.data);
          assert.isUndefined(result.body.errors,)
          assert.equal(result.body.data.title, 'Test Board')
          assert.isDefined(result.body.data.id);
        })
    });

    it('open - not found', async () =>{
      return chai.request(server)
        .get(`/board/${TEST_BOARD + '.not-found'}`)
        .set('authorization', token)
        .then((result) => {
          assert.equal(result.status, 200)
          assert.isDefined(result.body.errors)
          assert.equal(result.body.errors.length, 1)
          assert.equal(result.body.errors[0].title, 'board not found')
        })
    });

    it('patch', () => {
      const DESC = 'new description';
      return chai.request(server)
        .patch(`/board/${TEST_BOARD_ID}`)
        .set('authorization', token)
        .send({
          description: DESC
        })
        .then((result) => {
          assert.equal(result.status, 200)
          assert.isDefined(result.body.data);
          assert.equal(result.body.data.description, DESC, 'success', result.body.message)

        })
    });
  })


  describe('without login', () => {
    before( async() => {
      let session = {userId: await Init.AuthUserId};
      await Board.delete({userId: Board.ROOT_USER}, TEST_BOARD)
    })

    it('create', () => {
      return chai.request(server)
        .post('/board')
//        .type('form')
        .send({name: TEST_BOARD, title:'Test Board'})
        .then((result) => {
          assert.equal(result.status, 403)
          assert.equal(result.body.errors.length, 1);

        })
    })

    it('open', () => {
      return chai.request(server)
        .get(`/board/${TEST_BOARD}`)
        .then((result) => {
          assert.equal(result.status, 403)
          assert.isDefined(result.body.errors);
        })
    });
  })
})
