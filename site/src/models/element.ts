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
import {debug, warn, error, LocationError, newError} from '../vendors/lib/logging'
import Axios from '../vendors/lib/axios';
import { axiosActions } from '../vendors/lib/const';
/**
 * the element linked from the API
 */
export interface ElementLink {
  id?: string;
  // any extra information like position, ordering etc
  // the information is loaded by the this.elementLink(link)
  // which can be overloaded for different element types
}

interface ElementItem {
  link: ElementLink,
  item: Element
}

export interface ElementStored {
  id: string,
  type: string,
  key: string,
  title: string,
  elements: Array<ElementLink>
}

export interface ElementArray extends Array<ElementItem> {}

class Element {
  readonly board: Board;
  private _isDirty: boolean = false;
  // the class definition
  protected _children: ElementArray = undefined;
  // the raw element stored on disk
  protected element: ElementStored;
  protected updatableFields = ['key','title','description'];
  readonly changedData = {};
  protected _isNew : boolean = false;

  /**
   * t
   * @param board
   * @param element Object the raw object return from the API
   */
  constructor(board : Board, element: ElementStored, options) {
    if (!board) {
      throw new LocationError('missing board', 'Element.constructor')
    }
    this.board = board;
    this.element = element;
    this._isNew = !! (options && options.isNew)
  }

  get type() : string{
    return this.element.type;
  }
  get id() : string {
    return this.element.id
  }
  get key() : string {
    return this.element.key
  }
  set key(v) {
    this.updateElementField('key', v)
  }
  get title() {
    return this.element.title
  }
  set title(v) {
    this.updateElementField('title', v)
  }

  get isDirty() : boolean {
    return this._isDirty
  }
  get isNew() : boolean {
    return this._isNew
  }
  /**
   * remove the link this id
   * @param id
   */
  async linkDelete(id) {

  }

  protected updateElementField(field, value) {
    if (this.element[field] !== value) {
      this.element[field] = value
      this.changedData[field] = value;
      this._isDirty = true;
    }
  }

  dirtyClear() {
    this._isDirty = false;
    this._isNew = false;
  }

  /**
   * called when a element is removed and we request all other elements to remove any reference to this id
   * @param element
   */
  deleteRef(element: Element) {
  }

  /**
   * returns the list Elements in order
   * @returns Array[<Element>]
   */
  get childItems() {
    return this.children().map((c) => c.item);
  }

  protected createElementLink(elementLink: ElementLink) : ElementItem{
    return {
      link: elementLink,
      item: this.board.elements.get(elementLink.id)
    }
  }
  /**
   * list their reference
   * @returns Array[ElementItem])
   */
  // get elementLinks() {
   children(order = false) {
    if (!this._children) {
      this._children = [];
      // we have to load them
      if (this.element.elements) {
        for (let elm of this.element.elements) {
          if (!this.board.hasElement(elm.id)) {
            warn(`element ${elm.id} does not exist. record skipped`, 'Element.children')
          } else {
            this._children.push(this.createElementLink(elm))
          }
        }
      }
    }
    return this._children;
  }


  /**
   * set the update for the changed linked elements
   */
  _storeChildren() {
     let elmLinks = [];
     let children = this.children()
     for (let index = 0; index < children.length; index++) {
       elmLinks.push(children[index].link)
     }
     this.updateElementField('elements', elmLinks);
  }
  /**
   * add a new element ot this on
   * @param element
   * @param linkInfo Possible extra information
   * @param position Where to place it
   */
  childAdd(element, linkInfo: ElementLink = {}, position = -1) {
    // load the children if they are not there yet
    let children = this.children();
    Object.assign(linkInfo, {id: element.id})
    let elmLink = this.createElementLink(linkInfo)
    if (Number.isInteger(position) &&position >= 0 && position < children.length) {
      children.splice(position, 0, elmLink);
    } else {
      children.push(elmLink);
    }
    this._storeChildren();
  }



  childRemove(element) {
    let children = this.children();
    let index = children.findIndex((e) => e.link.id === element.id);
    if (index >= 0) {
      children.splice(index, 1);
      this._storeChildren();
    }
  }
}

export default Element;

