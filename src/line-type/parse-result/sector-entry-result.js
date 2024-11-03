"use strict"

import BaseShipEventResult from "./base-ship-event-result";

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result";

class SectorEntryResult extends BaseShipEventResult {
  /**
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;
}

export default SectorEntryResult;