/**
 * WAT GAAT HIER FOUT!!!!!!
 */



import Board from './board';
import {debug, error, newError, LocationError} from '../vendors/lib/logging';
import Axios, { setHeaders } from '../vendors/lib/axios';
import {apiState} from '../vendors/lib/const';
import { axiosActions } from '../vendors/lib/const';

// interface Boards {
//   [index: number]: Board
// }
interface Boards extends Array<Board> {}

export default class Database {
  private boardsLoaded: boolean = false;
  private _boards : Boards; //  Array<Board> = []


  async load() {
    if (!this.boardsLoaded) {
      const LOC = 'database.load';
      try {
        this._boards = [];
        debug(`loading all`, LOC)
        let res = await Axios.get('/board/list');
        if (axiosActions.isOk(res)) {
          let boardList = axiosActions.data(res);
          for (let b of boardList) {
            let boardClass = new Board(b);
            debug(boardClass, `${LOC}.board`);
            this._boards.push(boardClass);
          }
          debug(this._boards, `${LOC}.loaded`)
        } else {
          let err = newError(axiosActions.errors(res), LOC)
          error(err, LOC);
          throw err;
        }
        this.boardsLoaded = true;
      } catch (e) {
        error(e, LOC)
        throw e
      }
    }
    return true;
  }

  async reload() {
    this.boardsLoaded = false;
    return this.load()
  }

  async boards(){
    await this.load();
    return this._boards;
  }

  async _load(data) {
    if (!data.isLoaded()) {
      const LOC = 'database.boardById';
      let url = `/board/${data.id}`
      debug(`loading board ${url}`, LOC)
      let res = await Axios.get(url);
      if (axiosActions.isOk(res)) {

        let boardData = axiosActions.data(res);
        data.load(boardData);
      } else {
        let err = newError(axiosActions.errors(res), LOC)
        error(err, LOC);
        throw err;
      }
    }
    return data
  }
  async boardByIndex(index) {
    let boards = await this.boards();
    if (!Number.isInteger(index) || index < 0  || index >= boards.length) {
      throw newError(`index ${index} out of range`, 'database.boardByIndex')
    }
    return await this._load(boards[index]);
  };

  async boardById(id) {
    let boards = await this.boards();
    let b = boards.find((x) => x.id === id);
    if (!b) {
      throw newError(`board ${id} not found`, 'database.boardById')
    }
    return this._load(b)
  }

  async find(query): Promise<Boards> {
    let result: Boards = []
    let boards = await this.boards();
    for (let index = 0; index < boards.length; index++) {
      let isEqual = true;
      for (let fieldname in query) {
        if (!query.hasOwnProperty(fieldname)) { continue }
        if (boards[index].board[fieldname] != query[fieldname]) {
          isEqual = false;
          break;
        }
      }
      if (isEqual) {
        result.push(boards[index]);
      }
    }
    return result;
  }

  async boardCreate(boardObj) {
    try {
      let result = await Axios.post('board', boardObj);
      if (axiosActions.isOk(result)) {
        let board = axiosActions.data(result);
        let boardClass = new Board(board)
        this._boards.push(boardClass);
        return boardClass;
      } else {
        throw newError(axiosActions.errors(result), 'database.boardDelete');
      }
    } catch(e) {
      error(e, 'database.boardCreate');
      throw newError(e, 'database.boardDelete');
    }
  }

  async boardUpdate(board) {
    if (board.isDirty) {
      let result = await Axios.patch(`board/$(board.id}`, board.changedData())
    }
  }

  /**
   * delete all
   * @param query Object as filter of String: the id
   * @return Boolean true: found and deleted, false: not found
   */
  async boardDelete(query) {
    if (typeof query === 'string') {
      query = {id: query}
    }
    let records = await this.find(query);
    if (records.length) {
      for (let rec of records) {
        let result = await Axios.delete(`board/${rec.id}`);
        if (axiosActions.isOk(result)) {
          let index = this._boards.findIndex( (b) => b.id === rec.id);
          if (index < 0) {
            throw new LocationError(`could not find board ${rec.id}`, 'database.boardDelete')
          }
          this._boards.splice(index, 1)
        } else {
          throw newError(axiosActions.errors(result), 'database.boardDelete');
        }
      }
      return true;
    } else {
      return false;
    }
  }
}


