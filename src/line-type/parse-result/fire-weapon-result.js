"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";
import WeaponDamageResult from "../../regex/parse-result/weapon-damage-result.js";
import BaseShipEventResult from "./base-ship-event-result.js";

class FireWeaponResult extends BaseShipEventResult {
  /**
   * the target ship that is being fired upon
   * @type {ShipNameAndNccResult}
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
}

export default FireWeaponResult;