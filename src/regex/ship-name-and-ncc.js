"use strict"

import {pattern} from 'regex';
import Expression from './expression';

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