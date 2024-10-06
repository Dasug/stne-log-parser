"use strict"

import {pattern} from 'regex';
import Expression from './expression';

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
}

export default ShipNameAndNcc;