"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class HullDamageResult {
  /**
   * ship whose hull was hit
   * @type {ShipNameAndNccResult}
   */
  ship;

  /**
   * damage taken by the hull
   * @type {number}
   */
  hullDamage;

  /**
   * damage taken above what was needed to destroy/disable the ship
   * @type {number}
   */
  overkillDamage;

  /**
   * remaining hull strength
   * @type {number}
   */
  remainingHullStrength;
}

export default HullDamageResult;