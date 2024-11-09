"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class EnergyDamageResult {
  /**
   * ship that was hit by EMP
   * @type {ShipNameAndNccResult}
   */
  ship;

  /**
   * energy damage taken
   * @type {number}
   */
  energyDamage;

  /**
   * remaining energy on the struck ship
   * @type {number}
   */
  remainingEnergy;

  /**
   * energy on the ship before the hit
   * @type {number}
   */
  energyBefore;

  /**
   * did the ship get disabled by the hit?
   * @type {boolean}
   */
  shipDisabled;
}

export default EnergyDamageResult;