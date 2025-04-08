"use strict"

import SystemBlockadeState from "../../enum/system-blockade-state.js";
import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class SystemBlockadeResult {
  /** 
   * ship that raised or dropped the blockade
   * @type {ShipNameAndNccResult}
  */
  ship;

  /**
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;

  /**
   * state of the blockade
   * @type {SystemBlockadeState}
   */
  state;
}

export default SystemBlockadeResult;