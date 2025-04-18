"use strict"

import BuildingResult from "../../regex/parse-result/building-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class ShotMissedResult {
  /**
   * ship or building that fired the shot
   * @type {ShipNameAndNccResult|BuildingResult}
   */
  origin;
}

export default ShotMissedResult;