"use strict"

import {pattern} from 'regex';
import Expression from './expression';

class MapCoordinates extends Expression {
  static regexPattern = pattern`
    (?<x> \d+)\|(?<y> \d+)
  `;
}

export default MapCoordinates;