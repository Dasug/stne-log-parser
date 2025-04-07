"use strict"

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result.js";
import ShipNameOnlyResult from "../../regex/parse-result/ship-name-only-result.js";

class TractorBeamLockResult {
  /**
   * ship that triggered the log
   * @type {ShipNameOnlyResult}
   */
  ship;

  /**
   * sector the log was triggered in
   * @type {MapCoordinatesResult}
   */
  sector;

  /**
   * ship the tractor beam is directed at
   * @type {ShipNameOnlyResult}
   */
  target;
}

export default TractorBeamLockResult;