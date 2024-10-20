"use strict"

import {pattern} from 'regex';
import Expression from './expression';
import ShipNameAndNccResult from './parse-result/ship-name-and-ncc-result';

/**
 * Parses a ship name with NCC, class and an optional NCC prefix.  
 * Examples: `Konrika [Friedensmission (2191321, Nova)`, `MyShip (NX-123456, Nova)`  
 * Returns the following named groups when matching:  
 * `ship_name`: name of the ship  
 * `ncc_prefix`: NCC prefixes like NX or NPC/Admin specific prefixes if existing  
 * `ncc`: ship id  
 * `ship_class`: ship class name
 */
class ShipNameAndNcc extends Expression {
  static regexPattern = pattern`
    # ship name
    (?<ship_name>.+)
    \ \(
    # NCC prefix if existing
    ((?<ncc_prefix>[a-zA-Z0-9]+)-)?
    # NCC
    (?<ncc>\d+)
    ,\ 
    # ship class
    (?<ship_class>.+)
    \)
  `;

  /**
   * @returns {?ShipNameAndNccResult} ship data extracted from the text or null if there's no match
   * @inheritdoc 
   */
  static matchResult(text) {
    const match = this.match(text);
    if(match === null) {
      return null;
    }
    
    const resultObject = new ShipNameAndNccResult;
    resultObject.name = match.groups.ship_name;
    resultObject.nccPrefix = match.groups.ncc_prefix !== undefined ? match.groups.ncc_prefix : null;
    resultObject.ncc = Number(match.groups.ncc);
    resultObject.shipClass = match.groups.ship_class;
    return resultObject;
  }
}

export default ShipNameAndNcc;