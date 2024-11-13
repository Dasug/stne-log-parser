"use strict"

import BaseShipEventResult from "./base-ship-event-result.js";

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result.js";
import ShipNameOnlyResult from "../../regex/parse-result/ship-name-only-result.js";

class EnterHangarResult extends BaseShipEventResult {
  /**
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;

  /** 
   * carrier ship or station whose hangar was entered
   * @type {ShipNameOnlyResult}
  */
  carrier;
}

export default EnterHangarResult;