"use strict"

import BaseShipEventResult from "./base-ship-event-result";

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result";

class UndockingResult extends BaseShipEventResult {
  /**
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;

  /** 
   * station the ships is undocking from
   * @type {ShipNameAndNccResult}
  */
  station;
}

export default UndockingResult;