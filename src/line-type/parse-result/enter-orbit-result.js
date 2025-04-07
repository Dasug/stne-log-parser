"use strict"

import BaseShipEventResult from "./base-ship-event-result.js";

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result.js";
import OrbitEntryDirection from "../../enum/orbit-entry-direction.js";
import ColonyNameAndIdResult from "../../regex/parse-result/colony-name-and-id-result.js";

class EnterOrbitResult extends BaseShipEventResult {
  /**
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;

  /**
   * which colony's orbit was entered / exited
   * @type {ColonyNameAndIdResult}
   */
  colony;

  /**
   * direction (entry / exit) of the orbital movement
   * @type {OrbitEntryDirection}
   */
  direction;
}

export default EnterOrbitResult;