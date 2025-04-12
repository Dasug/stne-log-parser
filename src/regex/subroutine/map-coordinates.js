"use strict"

import {pattern} from 'regex';
import Expression from './expression.js';
import MapCoordinatesResult from '../parse-result/map-coordinates-result.js';

const phaseMapId = 101;
const hangarMapId = 102;

/**
 * Parses a map coordinate pair. Currently only supports main map coordinates,  
 * Example: `123|456`  
 * Returns the following named groups when matching:  
 * `x`: x coordinate  
 * `y`: y coordinate
 * `orbit` `@` if in orbit, `undefined` otherwise
 * `map_id` id number if on a different map other than the main map, `Phase` if ship is phase shifted, `undefined` otherwise
 * `map_instance_id` instance id number if current map is instanced
 */
class MapCoordinates extends Expression {
  static regexPattern = pattern`
    (?<orbit> @)?
    (?<x> \d+)\|(?<y> \d+)
    (?:\#(?<map_id>\d+|(?:Phase)))?
    (?:\\(?<map_instance_id>\d+))?
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
    if(match.groups.map_id === "Phase") {
      resultObject.mapId = phaseMapId;
    } else {
      resultObject.mapId = match.groups.map_id !== undefined ? Number(match.groups.map_id) : 0;
    }

    resultObject.mapInstanceId = match.groups.map_instance_id !== undefined ? Number(match.groups.map_instance_id) : null;
    return resultObject;
  }
}

export default MapCoordinates;