"use strict"

import BaseShipEventResult from "./base-ship-event-result.js";

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result.js";
import ShipNameOnlyResult from "../../regex/parse-result/ship-name-only-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class HangarMovementResult extends BaseShipEventResult {
  /**
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;

  /** 
   * carrier ship or station whose hangar was entered
   * @type {ShipNameAndNccResult|ShipNameOnlyResult}
  */
  carrier;

  /**
   * direction of movement, true if entry, false if exit
   * @type {boolean}
   */
  isEntry;
}

export default HangarMovementResult;