/**
 * Element and it's linked children
 *
 *
 * {
 *     id,
 *     key,
 *     title,
 *     elements: Array [{
 *         ref: {
 *             id,
 *             extra info
 *         },
 *         element: {
 *             id,
 *             key,
 *             title,
 *             elements
 *         }
 *     }]
 * }
 */


import Board from "./board";
import {debug, error, LocationError} from '../vendors/lib/logging'

interface ElementRef {
  id: string
}

interface StoredElement {
  id: string,
  key: string,
  title: string,
  children: Array<ElementRef>
}

class Element {
  readonly board: Board;
  readonly id: string;
  // the class definition
  protected _children: Array<Element> = undefined;
  // the raw element stored on disk
  protected element: StoredElement;

  constructor(board : Board, id: string) {
    if (!board) {
      throw new LocationError('missing board', 'Element.constructor')
    }
    this.board = board;
    this.id = id;
    this._load();
  }

  get children() {
    if (this._children) {
      return this._children;
    } else {
      // we have to load them
      for (let elm of this.element.children) {
        if (!this.board.hasElement(elm.id)) {
          error(`element ${elm.id} does not exist. record skipped`, 'Element.load')
        } else {
          this._children.push(
              this.board.elements[elm.id])
        }
      }

    }
  }


  _load() {
    if (!this.board.has(this.id)) {
      throw new LocationError(`element ${this.id} not found`, 'Element.load')
    }
    this.children = [];
    this.element = this.board.element(this.id);
    for (let elm of this.element.elements) {
      if (!this.board.hasElement(elm.id)) {
        error(`element ${elm.id} does not exist. record skipped`, 'Element.load')
      } else {
        this.children.push(this.board.elements[elm.id])
      }
    }
  }
}

export default Element;
