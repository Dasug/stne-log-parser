"use strict"

import BaseShipEventResult from "./base-ship-event-result.js";

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result.js";

class DestroyShipResult extends BaseShipEventResult {
  /**
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;
}

export default DestroyShipResult;