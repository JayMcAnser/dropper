/**
 * auto generated layout that display all elements of the board
 */

import ElementLayout from "./element-layout";
import {debug} from '../vendors/lib/logging';
import Board from "./board";
import {ElementItemArray, ElementStored} from "./element";

class ElementInventory extends ElementLayout {
  private order? : string;

  constructor(board : Board, element: ElementStored = undefined, options = undefined) {
    super(board, {id: 'inventory', type: 'inventory'}, options);
  }

  get type() : string{
    return 'inventory';
  }
  get id() : string {
    return 'inventory'
  }
  get title() {
    return 'Inventory'
  }
  /**
   * this overloaded version reads all elements from the board and returns
   * them as if they are the children
   *
   * @param order String \\ Function(a, b)
   */
  children(order = undefined): ElementItemArray {
    if (!this._children) {
      this._children = [];
      this.board.elements.forEach((e) => {
        this._children.push(this.createElementLink(e));
      })
      this.order = order;
      if (this._children.length && order) {
        this.orderArray(this._children, this.order)
      }
    }
    return this._children;
  }

  reload() {
    debug(`reloading inventory`, 'element-inventory')
    if (this._children) {
      this._children.splice(0, this._children.length)
      this.board.elements.forEach((e) => {
        this._children.splice(this._children.length, 0, this.createElementLink(e))
        // this._children.push(this.createElementLink(e));
      })
    }
  }

}

export default ElementInventory
