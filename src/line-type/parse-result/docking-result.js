"use strict"

import BaseShipEventResult from "./base-ship-event-result";

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result";
import ShipNameOnlyResult from "../../regex/parse-result/ship-name-only-result";

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