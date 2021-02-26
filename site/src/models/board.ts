


import Element from "./element";
class Board {
  readonly id: string;
  readonly elements: Array<Element>

  constructor(id: string) {
    this.id = id;
    this.elements = [];
  }

  has(id) {
    return this.elements[id] !== undefined
  }
  element(id) {
    return this.elements[id]
  }
}

export default Board;
