"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result";

class ArmorAbsorptionResult {
  /**
   * sector the log line occured in
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