"use strict"

import BuildingResult from "../../regex/parse-result/building-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";
import WeaponDamageResult from "../../regex/parse-result/weapon-damage-result.js";

class FireWeaponResult {
  /**
   * ship or building that shot the weapon
   * @type {ShipNameAndNccResult|BuildingResult}
   */
  origin;

  /**
   * owner of the ship or building that shot the weapon, can be null if not included
   * @type {?PlayerNameAndIdResult}
   */
  owner;

  /**
   * the target that is being fired upon
   * if this is null, the target is a colony (that is not named in the log line)
   * @type {?ShipNameAndNccResult}
   */
  target;

  /**
   * the name of the weapon that's being fired
   * @type {string}
   */
  weaponName;

  /**
   * the strength of the weapon being fired
   * @type {WeaponDamageResult}
   */
  weaponStrength;

  /**
   * whether the weapon has been fired offensively
   * @type {boolean}
   */
  isOffensive;

  /**
   * whether the weapon has been fired defensively
   * @type {boolean}
   */
  get isDefensive() {
    return !this.isOffensive;
  }

  set isDefensive(value) {
    this.isOffensive = !value;
  }

  get targetIsColony() {
    return this.target === null;
  }

  get originIsColony() {
    return this.origin instanceof BuildingResult;
  }
}

export default FireWeaponResult;