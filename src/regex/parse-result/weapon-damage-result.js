"use strict"

import DisplayableRegexResult from "./displayable-regex-result.js";

class WeaponDamageResult extends DisplayableRegexResult {
  /**
   * shield damage amount
   * @type {number}
   */
  shieldDamage;

  /**
   * hull damage amount
   * @type {number}
   */
  hullDamage;

  /**
   * energy damage amount
   * @type {number}
   */
  energyDamage;

  asDisplayString() {
    return String.raw`Shield: ${this.shieldDamage} / Hull: ${this.hullDamage} / Energy: ${this.energyDamage}`;
  }
}

export default WeaponDamageResult;
