
const Init = require('./init-test');
const chai = require('chai');
const assert = chai.assert;

const Fs = require('fs');
const Path = require('path');
const Board = require('../models/board');
const Const = require('../vendors/lib/const');
const CreateSession = require('../vendors/controllers/auth').setupLogging;

describe('models.board', () => {

  const TEST_NAME = 'test-board';
  let session;
  let boardId;
  let dataDir = Path.join(__dirname, 'data');

  before( async () => {
    try {
      let req = {}
      CreateSession(req)
      session = req.session;
      session.userId = await Init.AuthUserId;
      await Board.delete(session, TEST_NAME);
    } catch(e){
      console.error(`model.board: ${e.message}`)
    }
  })

  describe('meta', () => {
    it('create', async() => {
      let board = await  Board.create(session, {name: TEST_NAME});
      assert.isTrue(board.id > '0');
      boardId = board.id
    });
    it ('create - duplicate', async() => {
      try {
        boardId = await Board.create(session, {name: TEST_NAME});
        assert.fail('board name is not unique')
      } catch(e) {
        assert.equal(e.message, `[board] ${Const.results.boardExists}`)
      }
    })

    it('findOne', async() => {
      let board = await Board.findOne(session, {name: TEST_NAME});
      assert.equal(board.id, boardId)
    })

    it('findAll', async() => {
      let boards = await Board.findAll(session);
      assert.isTrue(boards.length >= 1, 'found boards');
      assert.isTrue(boards.findIndex( (x) => x.name === TEST_NAME) >= 0, 'has test filename')
    });

    it('open', async() => {
      let board = await Board.open(session, TEST_NAME);
      assert.isDefined(board.id, 'found the board');
    });

    it('save', async() => {
      let board = await Board.open(session, TEST_NAME);
      board.elements = [{id: 1}]
      await Board.save(session, board.id, board);
      // check we wrote it to disk
      board = await Board.open(session, TEST_NAME);
      assert.isDefined(board.elements, 'has something');
      assert.equal(board.elements[0].id, 1)
    });

    it('update', async () => {
      let board = await Board.open(session, TEST_NAME);
      let id = board.id;
      board = {
        description: 'new description'
      }
      await Board.update(session, id, board);
      // check we wrote it to disk
      board = await Board.open(session, TEST_NAME);
      assert.isDefined(board.description, 'did create the field');
      assert.equal(board.description, 'new description')
    })

    it('update - wrong fieldname', async () => {
      let board = await Board.open(session, TEST_NAME);
      let id = board.id;
      board = {
        'DOES_NOT_EXIST': 'new description'
      }
      try {
        await Board.update(session, id, board);
        assert.fail('should not update board')
      } catch (e) {
        assert.equal(e.message, 'data is not valid');
        assert.isDefined(e.validationError);
        assert.equal(e.validationError.message, '"DOES_NOT_EXIST" is not allowed')
      }
    });

    it('update - multiple errors', async () => {
      let board = await Board.open(session, TEST_NAME);
      let id = board.id;
      board = {
        'DOES_NOT_EXIST': 'new description',
        'THIS_TOO': 'no reason'
      }
      try {
        await Board.update(session, id, board);
        assert.fail('should not update board')
      } catch (e) {
        assert.equal(e.message, 'data is not valid');
        assert.isDefined(e.validationError);
        assert.equal(e.validationError.message, '"DOES_NOT_EXIST" is not allowed')
      }
    });


    it('make public', async () => {
      let board = await Board.open(session, TEST_NAME);
      assert.isFalse(board.isPublic);
      await Board.setPublic(session, board, true);
      board = await Board.open(session, TEST_NAME);
      assert.isTrue(board.isPublic)
    });
  })
  describe('image', () => {
    it('image - add - by filename', async () => {
      let board = await Board.open(session, TEST_NAME);
      Fs.writeFileSync( Path.join(dataDir, 'image.png'), 'dummy date');
      let imageId = await Board.imageAdd(session, board, Path.join(dataDir, 'image.png'));
      assert.isDefined(imageId, 'return of the image id');
      let filename = Path.join(Board.rootDir, board.id, 'media', imageId + '.png')
      assert.isTrue(Fs.existsSync(filename), filename);

      let imageFilename = await Board.imageGet(session, board, imageId);
      assert.isTrue(Fs.existsSync(imageFilename))
    });

    it('image - add - by definition', async () => {
      let board = await Board.open(session, TEST_NAME);
      Fs.writeFileSync( Path.join(dataDir, 'image2.png'), 'dummy date');

      let imageId = await Board.imageAdd(session, board, {filename: Path.join(dataDir, 'image2.png'), name: 'testing'});
      assert.isDefined(imageId, 'return of the image id');
      let filename = Path.join(Board.rootDir, board.id, 'media', imageId + '.png')
      assert.isTrue(Fs.existsSync(filename), filename);

      let imageFilename = await Board.imageGet(session, board, imageId);
      assert.isTrue(Fs.existsSync(imageFilename))
    });
  });

  describe('element', () => {
    let elmId;
    it('create', async() => {
      let board = await Board.open(session, TEST_NAME);
      let element = await Board.elementAdd(session, board, {type: 'text', key: 'key1'});
      assert.isDefined(element.id, 'return create an element id');
      elmId = element.id;
    });
    it('is stored', async() => {
      let board = await Board.open(session, TEST_NAME);
      assert.isDefined(board.elements)
      assert.isTrue(Object.keys(board.elements).length > 0)
    });


    it ('remove', async () => {
      let board = await Board.open(session, TEST_NAME);
      let cnt = Object.keys(board.elements).length
      let element = await Board.elementRemove(session, board, elmId);
      board = await Board.open(session, TEST_NAME);
      assert.equal(Object.keys(board.elements).length, cnt -1)
    })
  })
});
