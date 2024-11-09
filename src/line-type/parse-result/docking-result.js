"use strict"

import BaseShipEventResult from "./base-ship-event-result.js";

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result.js";
import ShipNameOnlyResult from "../../regex/parse-result/ship-name-only-result.js";

class DockingResult extends BaseShipEventResult {
  /**
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;

  /** 
   * station the ships is dockin at
   * @type {ShipNameOnlyResult}
  */
  station;
}

export default DockingResult;