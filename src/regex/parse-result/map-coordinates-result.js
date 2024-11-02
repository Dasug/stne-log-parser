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

  /**
   * id of the current map
   * @type {number}
   */
  mapId;

  /**
   * id of the current map instance or null if map is not instanced
   * @type {?number}
   */
  mapInstanceId;
}

export default MapCoordinatesResult;