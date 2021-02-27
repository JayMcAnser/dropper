
import Board from './board'
import Element from "./element";
import {ElementStored} from './element';

class ElementColumn extends Element {
  constructor(board: Board, element: ElementStored, options) {
    super(board, element, options);
  }
}

export default ElementColumn;
