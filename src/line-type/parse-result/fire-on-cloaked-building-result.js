"use strict"

import WeaponDamageResult from "../../regex/parse-result/weapon-damage-result.js";

class FireOnCloakedBuildingResult {
  /**
   * name of the weapon that got fired on the cloaked building
   * @type {string}
   */
  weaponName;
  /**
   * the strength of the weapon being fired
   * @type {WeaponDamageResult}
   */
  weaponStrength;
}

export default FireOnCloakedBuildingResult;
