"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class ArmorAbsorptionResult {
  /**
   * ship that took the shot
   * @type {ShipNameAndNccResult}
   */
  ship;

  /** 
   * points of damage absorbed by the armor
   * @type {number}
  */
  armorAbsorption;
}

export default ArmorAbsorptionResult;