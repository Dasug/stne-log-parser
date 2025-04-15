"use strict"

import {pattern} from 'regex';
import Expression from './expression.js';
import SurfaceCoordinatesResult from '../parse-result/surface-coordinates-result.js';

/**
 * Parses a surface coordinate pair.  
 * Example: `3|4`
 * Returns the following named groups when matching:  
 * `x`: x coordinate  
 * `y`: y coordinate
 */
class SurfaceCoordinates extends Expression {
  static regexPattern = pattern`
    (?<x> \d+)\|(?<y> \d+)
  `;

  /**
   * @returns {?SurfaceCoordinatesResult} surface coordinates extracted from the text or null if there's no match
   * @inheritdoc 
   */
  static matchResult(text) {
    const match = this.match(text);
    if(match === null) {
      return null;
    }
    
    const resultObject = new SurfaceCoordinatesResult;
    resultObject.x = Number(match.groups.x);
    resultObject.y = Number(match.groups.y);
    
    return resultObject;
  }
}

export default SurfaceCoordinates;