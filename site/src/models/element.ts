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
import {debug, warn, error, LocationError, newError} from '../vendors/lib/logging';
import {cloneDeep} from 'lodash';
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
  key?: string,
  title?: string,
  elements?: Array<ElementLink>,
}

export interface ElementItemArray extends Array<ElementItem> {}
export interface ElementMap extends Map<string, Element> {}
export interface ElementArray extends Array<Element> {}

// const NO_UPDATE_PROPERTIES = ['id'];
class Element {

  readonly board: Board;
  private _isDirty: boolean = false;
  // the class definition
  protected _children: ElementItemArray = undefined;
  // the raw element stored on disk
  public element: ElementStored;

//  protected updatableFields = ['key','title','description'];
  private _changedData = {};
  // properties that should not be updated/removed by the model interface for editing
  protected no_update_properties = ['id', 'type']
  protected _isNew : boolean = false;

  /**
   * t
   * @param board
   * @param element Object the raw object return from the API
   * @param options Object {
   *   isNew boolean not yet stored on disk
   * }
   */
  constructor(board : Board, element: ElementStored = undefined, options = undefined) {
    if (!board) {
      throw new LocationError('missing board', 'Element.constructor')
    }
    let vm = this;
    const elementHandler = {
      deleteProperty: function(target, prop) {
        if (! vm.no_update_properties.includes(prop)) {
//          debug(`cancel remove property`, 'element.handler')
          delete target[prop]
        }
        return true;
      },
      set: function (target, prop, value, receiver) {
        if (vm.no_update_properties.includes(prop)) {
          return true;
        }
        vm._changedData[prop] = value;
        vm._isDirty = true;
        return Reflect.set(target, prop, value, receiver)
      }
    }
    this.board = board;
    if (!element) {
      warn(`element is missing the initialisation object`, 'element.constructor')
      this.element = new Proxy({}, elementHandler);
    } else {
      if (!element.id) {
        warn(`element is missing the id`, 'element.constructor')
      }
      this.element = new Proxy(element, elementHandler);
    }

    this._isNew = !! (options && options.isNew);
    if (this.isNew) {
      // we need the id and the type to create the element on the server
      vm._changedData['id'] = element.id;
      vm._changedData['type'] = element.type;
    }
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
  // set key(v) {
  //   this.updateElementField('key', v)
  // }
  get title() {
    return this.element.title
  }
  // set title(v) {
  //   this.updateElementField('title', v)
  // }


  get isNew() : boolean {
    return this._isNew
  }
  get visibleFields() {
    return Object.assign({}, this.element);
  }


  get isDirty() : boolean {
    return this._isDirty
  }

  get changedData() {
    // if changed through the model we don't know what field did change, so send everything
    return this._changedData
  }

  get model() : ElementStored {
    return this.element
  }
  //
  // set model(value) {
  //   this.updateElementField(value)
  // }

  get schema() {
    return {
      type: 'object',
      properties: {
        key: { type: 'string' },
        title: {type: 'string'},
      }
    }
  }
  /**
   * remove the link this id
   * @param id
   */
  async linkDelete(id) {

  }

  /**
   * check if the element confirms the query
   *
   * @param query String
   * @return boolean
   */
  filter(query) {
    debug(`${query}, ${this.element.title.toUpperCase()}`, 'element.filter')
    return (this.element.title && this.element.title.toUpperCase().indexOf(query.toUpperCase()) >= 0) ||
      (this.element.key && this.element.key.toUpperCase().indexOf(query.toUpperCase()) >= 0)
  }

  // protected updateElementField(field, value?) {
  //    if (this.element[field] !== value) {
  //      debug(`set ${field} to ${value}`, 'element.udate')
  //      this.element[field] = value
  //      this.changedData[field] = value;
  //      this._isDirty = true;
  //    }
  //    return true;
  // }
  // updateData(data) {
  //   for (let fieldname in data) {
  //     if (!data.hasOwnProperty(fieldname)) { continue }
  //     this.updateElementField(fieldname, data[fieldname])
  //   }
  // }

  dirtyClear() {
    this._changedData = {};
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

   children(order = undefined): ElementItemArray {
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
     this.element['elements'] = elmLinks;
     // this.updateElementField('elements', elmLinks);
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

  /**
   * moves the child record to a specific location
   * @param element
   * @param index 0 == first, -1 last otherwise: position
   */
  childMove(element, index) {
    let children = this.children();
    let elementIndex = children.findIndex((e) => e.link.id === element.id);
    if (elementIndex >= 0) {
      if (index < 0 || index >= children.length) {
        index = children.length - 1;
      }
      if (elementIndex !== index) {
        children.splice(elementIndex, 1);
        children.splice(index, 0, element);
      }
    } else {
     warn(`the element ${element.id} is not part of ${this.id}`)
    }
  }

  /**
   * Move an element one up or down
   * @param element
   * @param up true => for to 0 false move to end
   */
  childMoveStep(element, up:boolean = true) {
    let children = this.children();
    let elementIndex = children.findIndex((e) => e.link.id === element.id);
    if (elementIndex) {
      this.childMove(element, elementIndex + (up ? 1 : -1))
    } else {
      warn(`the element ${element.id} is not part of ${this.id}`)
    }
  }
}

export default Element;

