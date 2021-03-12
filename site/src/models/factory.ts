

import Element from './element';
import ElementColumn from './element-column';
import ElementText from './element-text'
import ElementImage from './element-image';
import { ElementStored } from './element';
import Board from './board';
import { warn } from '../vendors/lib/logging'
import ElementInventory from "./element-inventory";


export const ElementType = {
  board: 'board',
  column: 'column',
  text: 'text',
  image: 'image',
  inventory: 'inventory'
}


const Factory = function(board: Board, element: ElementStored = undefined, options: object ={}) {
   switch (element.type) {
     case ElementType.text:
       return new ElementText(board, element, options);
     case ElementType.image:
       return new ElementImage(board, element, options);
     case ElementType.column:
       return new ElementColumn(board, element, options);
     case ElementType.inventory:
       return new ElementInventory(board, element, options)
     default:
       warn(`unknown element type: ${element.type}`, 'model.factory')
       return new Element(board, element, options)
   }
}

export default Factory;

