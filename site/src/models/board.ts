


import { axiosActions } from '../vendors/lib/const';
// import Axios, { setHeaders } from '../vendors/lib/axios';
// import {apiState} from '../vendors/lib/const';

import Axios from '../vendors/lib/axios';
import { debug, newError } from '../vendors/lib/logging'
import Element, {ElementItemArray} from "./element";
import Factory, {ElementType} from './factory';
import {ElementStored, ElementArray, ElementMap} from "./element";
import ElementInventory from "./element-inventory";

/**
 * the fysical definition of a board returned by the API
 */
interface BoardStore {
  id: string,
  title: string,
  name: string,
  isPublic: string,
  description: string,
  // should be more defined ....
  elements?: Array<ElementStored>,
}


class Board {
  readonly board: BoardStore;
  private _loaded: boolean = false;
  private _elements: Map<string, Element>;
  private _deleted: ElementArray = [];
  private _isDirty: boolean = false;
  private _changes: Object = {};
  private _inventory: ElementInventory;

  constructor(board: BoardStore) {
    this.board = board;
    this._elements = new Map();
  }

  /**
   * load the board information from the raw data
   * @param data Object full board returned from API
   */
  load(data) {
    for (let id in data.elements) {
      let elm = data.elements[id]
      let elmClass = Factory(this, elm);
      if (elmClass) {
        // if an error ocurred we do NOT push it
        this._elements.set(elmClass.id, elmClass)
      }
    }
    this._loaded = true;
  }

  protected _clearCache() {
    if (this._inventory) {
      this._inventory.reload();
    }
  }

  filter(elements: ElementItemArray, query) {
    if (query && elements && elements.length) {
      return elements.filter( (e) => {
        return e.item.filter(query)
      })
    } else {
      return elements
    }
  }

  get inventory() : Element { // ElementArray {
    if (!this._inventory) {
      this._inventory = new ElementInventory(this);
    }
    return this._inventory;
    // if (filter && filter.length) {
    //   return this.filter(this._inventory.children(), filter).map(e => e.item)
    // } else {
    //   return this._inventory.children().map(e => e.item)
    // }
  }

  layouts(options): ElementArray {
    if (!this._inventory) {
      this._inventory = new ElementInventory(this);
    }
    let result = [this._inventory];
    this._elements.forEach((e) => e.type === 'layout')
    return result;
  }


  get isDirty() {
    return this._isDirty || this.dirtyElements.length > 0 || this._deleted.length > 0;
  }
  get id() {
    return this.board.id
  }
  get name() {
    return this.board.name;
  }
  set name(value) {
    this.addChange('name', value)
  }
  get title() {
    return this.board.title
  }
  set title(value) {
    this.addChange('title', value)
  }

  addChange(fieldname, value) {
    if (this.board[fieldname] !== value) {
      this.board[fieldname] = value;
      this._changes[fieldname] = value;
      this._isDirty = true;
    }
  }

  /**
   * returns the changes to properties of the board NOT to the elements
   */
  changedInfo() {
    return this._changes;
  }

  hasChanges() : boolean {
    return Object.keys(this._changes).length > 0
  }
  /**
   * access to the all elements on the board in a none nested version
   * @returns Map index by the id of the element
   */
  get elements() : ElementMap { //  Map<string, Element> {
    return this._elements;
  }
  element(id) : Element {
    switch(id) {
      case 'inventory':
        return this.inventory
      default:
        return this._elements.get(id)
    }
  }

  get elementCount() {
    return this._elements.size;
  }
  /**
   * list the columns of this board
   */
  get columns() : ElementArray {
    let cols = [];
    this._elements.forEach((elm, key, map) => {
      if (elm.type === ElementType.column) {
        cols.push(elm);
      }
    })
    return cols;
  }

  isLoaded() {
    return this._loaded
  }
  hasElement(id) {
    return this._elements.has(id)
  }

  /**
   * returns the elements that are dirty
   * @protected
   * @returns Array<Element>
   */
  protected get dirtyElements() {
    let result = []
    this._elements.forEach((e) => {
      if (e.isDirty || e.isNew) {
        result.push(e)
      }
    })
    return result
  }

  async save() {
    if (this.isDirty) {
      // ToDo should start a transaction on the server
      let dirtyOnes = this.dirtyElements;
      for (let index = 0; index < dirtyOnes.length; index++) {
        let elmData = dirtyOnes[index].changedData;
        let result;
        if (dirtyOnes[index]._isNew) {
          result = await Axios.post(`board/${this.id}/element`, elmData);
        } else {
          result = await Axios.patch(`/board/${this.id}/element/${dirtyOnes[index].id}`, elmData);
        }
        if (axiosActions.isOk(result)) {
          dirtyOnes[index].dirtyClear();
        } else {
          // rollback the transaction
          throw newError(axiosActions.errors(result), 'board.elementUpdate');
        }
      }
      for (let index = 0; index < this._deleted.length; index++) {
        let result = await Axios.delete(`board/${this.id}/element/${this._deleted[index].id}`);
        if (axiosActions.isOk(result)) {
        } else {
          throw newError(axiosActions.errors(result), 'board.elementDelete');
        }
      }
      this._deleted = [];
      if (this.hasChanges()) {
        let result = await Axios.patch(`/board/${this.id}`, this.changedInfo());
        if (!axiosActions.isOk(result)) {
          // rollback the transaction
          throw newError(axiosActions.errors(result), 'board.update');
        } else {
          this._changes = {};
        }
      }
      // commit the transaction
      this._isDirty = false;
    }
    this._clearCache();
    debug(this._inventory, 'board.ts')
    return this;
  }

  async elementCreate(data) {
    let result = await Axios.post(`board/${this.id}/elementId`, data);
    if (axiosActions.isOk(result)) {
      Object.assign(data, axiosActions.data(result));
      let elementClass = Factory(this, data,{isNew: true});
//      elementClass.updateData(data);
      this._elements.set(data.id, elementClass);
      this._clearCache();
      return elementClass;
    } else {
      throw newError(axiosActions.errors(result), 'board.elementCreate');
    }
  }

  /**
   * cancel the previous create
   */
  async elementCancel(id) {
    debug(`remove ${id}`, 'board.elementCancel')
    this._elements.delete(id);
    this._clearCache();
  }

  async elementDelete(element) {
    this._deleted.push(this.element(element.id));
    this._elements.delete(element.id);
    this._elements.forEach((e) => {
      e.deleteRef(element)
    });
    this._clearCache();
  }

}

export default Board;
