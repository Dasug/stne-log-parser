"use strict"

import {pattern} from 'regex';
import Expression from './expression';
import MapCoordinatesResult from './parse-result/map-coordinates-result';

/**
 * Parses a map coordinate pair. Currently only supports main map coordinates,  
 * Example: `123|456`  
 * Returns the following named groups when matching:  
 * `x`: x coordinate  
 * `y`: y coordinate
 * `orbit` `@` if in orbit, `undefined` otherwise
 */
class MapCoordinates extends Expression {
  static regexPattern = pattern`
    (?<orbit> @)?
    (?<x> \d+)\|(?<y> \d+)
  `;

  /**
   * @returns {?MapCoordinatesResult} map coordinates extracted from the text or null if there's no match
   * @inheritdoc 
   */
  static matchResult(text) {
    const match = this.match(text);
    if(match === null) {
      return null;
    }
    
    const resultObject = new MapCoordinatesResult;
    resultObject.x = match.groups.x !== undefined ? Number(match.groups.x) : null;
    resultObject.y = match.groups.y !== undefined ? Number(match.groups.y) : null;
    resultObject.orbit = match.groups.orbit !== undefined;
    return resultObject;
  }
}

export default MapCoordinates;