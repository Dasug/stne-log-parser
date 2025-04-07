"use strict"

import ShipNameOnlyResult from "../../regex/parse-result/ship-name-only-result.js";

class TractorBeamStruggleResult {
  /**
   * ship that is holding the lock
   * @type {ShipNameOnlyResult}
   */
  ship;

  /**
   * ship that is held in the tractor beam
   * @type {ShipNameOnlyResult}
   */
  target;
}

export default TractorBeamStruggleResult;