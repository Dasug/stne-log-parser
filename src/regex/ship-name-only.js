"use strict"

import {pattern} from 'regex';
import Expression from './expression';
import ShipNameOnlyResult from './parse-result/ship-name-only-result';

/**
 * Parses a ship name only without added NCC, class etc..  
 * Example: `[Starbase] New Koweston` or any name usually but not always between 2 and 25 characters long
 * Returns the following named groups when matching:  
 * `ship_name`: name of the ship  
 */
class ShipNameOnly extends Expression {
  // normal ship names should only be up to 25 (visible) characters long but in some circumstances they can be longer
  static regexPattern = pattern`
    (?<ship_name>.{2,45})
  `;

  /**
   * @returns {?ShipNameOnlyResult} ship data extracted from the text or null if there's no match
   * @inheritdoc 
   */
  static matchResult(text) {
    const match = this.match(text);
    if(match === null) {
      return null;
    }
    
    const resultObject = new ShipNameOnlyResult;
    resultObject.name = match.groups.ship_name;
    return resultObject;
  }
}

export default ShipNameOnly;