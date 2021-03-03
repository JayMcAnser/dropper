/**
 * the basic definition for layouts / presentations of a board
 *
 * version 0.0.1 Jay 2021-02-28
 */
import Element from "./element";
import {warn} from '../vendors/lib/logging';

class ElementLayout extends Element {
  protected subType: string;

  protected orderArray(arr, order) {
    if (typeof order === 'string' && arr[order] !== undefined) {
      this._children.sort((a, b) => {
        return a[order].localeCompare(b[order], undefined, {sensitivity: 'base'})
      })
    } else if (typeof order === 'string' && order.indexOf('.') >= 0) {
      // looking into an object that is part of the child record
      warn(`the order by child object (${order}) is not yet implemented`, 'layout.orderArray')
    } else if (typeof order === 'function') {
      warn(`the order by function is not yet implemented`, 'layout.orderArray')
    }
    return arr;
  }

}

export default ElementLayout;
