"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result";

class ShieldDamageResult {
  /**
   * ship whose shields were hit
   * @type {ShipNameAndNccResult}
   */
  ship;

  /**
   * damage taken by the shields
   * @type {number}
   */
  shieldDamage;

  /**
   * remaining shield strength
   * @type {number}
   */
  remainingShieldStrength;
  
  /**
   * have the shields collapsed from the hit?
   * @type {boolean}
   */
  shieldsCollapsed;
}

export default ShieldDamageResult;