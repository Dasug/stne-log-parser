"use strict"

import ShipNameOnlyResult from "../../regex/parse-result/ship-name-only-result.js";

class TractorBeamStruggleCostResult {
  /**
   * ship that is holding the tractor beam
   * @type {ShipNameOnlyResult}
   */
  ship;

  /**
   * ship that is held in the tractor beam
   * @type {ShipNameOnlyResult}
   */
  target;

  /**
   * energy lost by struggling to break free from the tractor beam
   * @type {number}
   */
  energyCost;

  /**
   * flight range lost by struggling to break free from the tractor beam
   * @type {number}
   */
  flightRangeCost;
}

export default TractorBeamStruggleCostResult;