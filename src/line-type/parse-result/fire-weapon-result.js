"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";
import WeaponDamageResult from "../../regex/parse-result/weapon-damage-result.js";
import BaseShipEventResult from "./base-ship-event-result.js";

class FireWeaponResult extends BaseShipEventResult {
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
}

export default FireWeaponResult;