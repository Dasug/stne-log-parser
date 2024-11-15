"use strict"

import {pattern} from 'regex';
import Expression from './expression.js';
import ItemResult from './parse-result/item-result.js';

/**
 * Parses an item with its type id and optionally its item id 
 * Examples: `Spektralersplitter (111001)`, `Lackierungsset "Verlassene" für die Klaestron (1592912, 111121)`  
 * Returns the following named groups when matching:  
 * `item_name`: name of the item  
 * `item_id`: id of the specific item if present  
 * `item_type_id`: id of the type the item belongs to
 */
class Item extends Expression {
  static regexPattern = pattern`
    (?<item_name>.+)
    \ \(
    (?:
      (?<item_id>\d+)
      ,\ 
    )?
    (?<item_type_id> \d+)
    \)
  `;

  /**
   * @returns {?ItemResult} item data extracted from the text or null if there's no match
   * @inheritdoc 
   */
  static matchResult(text) {
    const match = this.match(text);
    if(match === null) {
      return null;
    }
    
    const resultObject = new ItemResult;
    resultObject.name = match.groups.item_name;
    resultObject.itemId = typeof match.groups.item_id !== "undefined" ? Number(match.groups.item_id) : null;
    resultObject.itemTypeId = Number(match.groups.item_type_id);
    
    return resultObject;
  }
}

export default Item;