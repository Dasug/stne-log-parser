"use strict"

import {pattern} from 'regex';
import Expression from './expression';

/**
 * Parses a map coordinate pair. Currently only supports main map coordinates,  
 * Example: `123|456`  
 * Returns the following named groups when matching:  
 * `x`: x coordinate  
 * `y`: y coordinate
 */
class MapCoordinates extends Expression {
  static regexPattern = pattern`
    (?<x> \d+)\|(?<y> \d+)
  `;
}

export default MapCoordinates;