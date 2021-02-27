
// import 'mocha';
const Init = require('./init-test');
const chai = require('chai');
const assert = chai.assert;

//const Database = require('../models/database.js')
import Database from '../models/database'
import {setHeaders} from '../vendors/lib/axios';
import { ElementType } from '../lib/factory';


describe('data model', () => {
  // describe('database', () => {
  //   it('load all boards', async () => {
  //     let database = new Database();
  //     await database.load();
  //     let boards = await database.boards();
  //     assert.isTrue(boards.length > 1, 'found some boards');
  //   });
  //
  //   it('by index', async () => {
  //     let database = new Database();
  //     let board = await database.boardByIndex(0);
  //     assert.isTrue(board.elementCount > 0, 'has elements loaded');
  //     assert.isTrue(board.columns.length > 0)
  //   });
  // });
  //
  // describe('board', () => {
  //   const boardName = 'dropper.database-test';
  //   let database;
  //   let authToken;
  //   let boardId;
  //
  //   before( async() => {
  //     authToken = await Init.AuthToken;
  //     setHeaders(authToken)
  //     database = new Database();
  //     await database.load();
  //     await database.boardDelete({name: boardName})
  //   });
  //
  //   it('create', async () => {
  //     let board = await database.boardCreate({name: boardName, title: boardName})
  //     assert.isDefined(board.id)
  //     assert.equal(board.name, boardName)
  //     boardId = board.id;
  //   })
  //
  //   it('load / storing', async() => {
  //     let board = await database.boardById(boardId);
  //     assert.equal(board.name, boardName);
  //
  //     let board2 = await database.boardById(boardId);
  //     assert.equal(board2.title, boardName)
  //     board.title = 'some change';
  //     assert.isTrue(board.isDirty);
  //     assert.equal(board2.title, 'some change', 'should refer to the same structure')
  //     assert.isTrue(board2.isDirty);
  //     let result = await board.save();
  //     assert.equal(result.id, board.id)
  //
  //     let db2 = new Database();
  //     await db2.load()
  //
  //     let board3 = await database.boardById(boardId);
  //     assert.equal(board3.title, 'some change');
  //   })
  // });
  //
  // describe('element', () => {
  //   const boardName = 'dropper.database-test.element';
  //   const boardName2 = 'dropper.database-test.element.2';
  //   let database;
  //   let authToken;
  //   let board;
  //   let element;
  //
  //   before( async() => {
  //     authToken = await Init.AuthToken;
  //     setHeaders(authToken)
  //     database = new Database();
  //     await database.load();
  //     await database.boardDelete({name: boardName})
  //     await database.boardDelete({name: boardName2})
  //     board = await database.boardCreate({name: boardName, title: boardName})
  //   });
  //
  //   it('create', async () => {
  //     element = await board.elementCreate({type: 'column', key: 'column 1' })
  //     assert.isDefined(element.id);
  //     assert.equal(element.type,'column');
  //     // this should send ALL info to the server
  //     await board.save();
  //     // now it should be written to disk
  //     let db2 = new Database();
  //     await db2.load();
  //     let boardUpdated = await db2.boardById(board.id);
  //     let elm2 = boardUpdated.element(element.id);
  //     assert.isDefined(elm2.id);
  //     assert.equal(elm2.key, 'column 1', 'did save by the save()')
  //   });
  //
  //   it('find', () => {
  //     assert.equal(board.elementCount, 1);
  //     assert.equal(board.element(element.id).key, 'column 1');
  //   })
  //
  //   it('edit', async () => {
  //     const NEW_TITLE = 'new title'
  //     let elm = board.element(element.id);
  //     elm.title = NEW_TITLE;
  //     await board.save();
  //     // now reload the dataset from disk and request the same info
  //     let db2 = new Database();
  //     await db2.load();
  //     let boardUpdated = await db2.boardById(board.id);
  //     assert.equal(boardUpdated.title, boardName, 'should find it');
  //     elm = boardUpdated.element(element.id);
  //     assert.equal(elm.title, NEW_TITLE, 'did save this element');
  //   });
  //
  //   it('edit multiple', async() => {
  //     let b2 = await database.boardCreate({name: boardName2, title: 'board 2'})
  //     let e1 = await b2.elementCreate({type: 'column', key: 'column.1' })
  //     let e2 = await b2.elementCreate({type: 'column', key: 'column.2' })
  //     e1.title = 'some 1';
  //     e2.title = 'some 2'
  //     await b2.save();
  //
  //     let db2 = new Database();
  //     await db2.load();
  //     let boardUpdated = await db2.boardById(b2.id);
  //     assert.equal(boardUpdated.elementCount, 2);
  //     assert.equal(boardUpdated.element(e1.id).title, 'some 1');
  //     assert.equal(boardUpdated.element(e2.id).key, 'column.2');
  //
  //     b2.elementDelete(e1);
  //     assert.equal(b2.elementCount, 1);
  //     await b2.save();
  //     assert.equal(b2.elementCount, 1);
  //
  //     db2 = new Database();
  //     await db2.load();
  //     boardUpdated = await db2.boardById(b2.id);
  //     assert.equal(boardUpdated.elementCount, 1);
  //   })
  // })

  describe('children', () => {
    const boardName = 'dropper.database-test.child';

    let database;
    let authToken;
    let board;
    let eColumn;
    let eItem1, eItem2,eItem3

    before( async() => {
      authToken = await Init.AuthToken;
      setHeaders(authToken)
      database = new Database();
      await database.load();
      await database.boardDelete({name: boardName})

      board = await database.boardCreate({name: boardName, title: boardName})
      eColumn = await board.elementCreate({type: 'column', key: 'col1'});
      eItem1 = await board.elementCreate({type: 'text', key: 'text1'});
      eItem2 = await board.elementCreate({type: 'text', key: 'text2'});
      eItem3 = await board.elementCreate({type: 'text', key: 'text3'});
      await board.save();
    });

    it('add childs', async() => {
      assert.equal(eColumn.children().length, 0)
      eColumn.childAdd(eItem1);
      assert.equal(eColumn.children().length, 1)
      await board.save();

      let db2 = new Database();
      await db2.load();
      let b2 = await db2.boardById(board.id);
      let c2 = b2.element(eColumn.id);
      assert.equal(c2.children().length, 1, 'did we store the relation')
    });


    it('remove child', async() => {
      let cnt = eColumn.children().length
      assert.equal(eColumn.children().length, cnt )
      eColumn.childRemove(eItem1);
      assert.equal(eColumn.children().length, cnt -1)
      await board.save();

      let db2 = new Database();
      await db2.load();
      let b2 = await db2.boardById(board.id);
      let c2 = b2.element(eColumn.id);
      assert.equal(c2.children().length, cnt -1, 'did we store the relation')
    });

  })
});
