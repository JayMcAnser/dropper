

import Element from './element';
import ElementColumn from './element-column';
import ElementText from './element-text'
import { ElementStored } from './element';
import Board from './board';
import { debug } from '../vendors/lib/logging'


export const ElementType = {
  board: 'board',
  column: 'column',
  text: 'text'
}


const Factory = function(board: Board, element: ElementStored, options: object ={}) {
   switch (element.type) {
     case ElementType.text:
       return new ElementText(board, element, options);
     case ElementType.column:
       return new ElementColumn(board, element, options)
     default:
       debug(`unknown element type: ${element.type}`)
       return new Element(board, element, options)
   }
}

export default Factory;

