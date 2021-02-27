
import Board from './board'
import {ElementStored} from './element';
import Element from "./element";

class ElementText extends Element {
  constructor(board: Board, element: ElementStored, options) {
    super(board, element, options);

  }
}

export default ElementText;
