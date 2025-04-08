"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class SystemBlockadeCaughtResult {
  /** 
   * ship that was caught by the blockade
   * @type {ShipNameAndNccResult}
  */
  ship;

  /**
   * flight range loss due to being caught in the blockade
   * @type {number}
   */
  flightRangeLoss;
}

export default SystemBlockadeCaughtResult;