"use strict"

class MapCoordinatesResult {
  /**
   * x coordinate or null if not applicable to current map
   * @type {?number}
   */
  x;

  /**
   * y coordinate or null if not applicable to current map
   * @type {?number}
   */
  y;

  /**
   * is current coordinate in orbit
   * @type {boolean}
   */
  orbit;
}

export default MapCoordinatesResult;