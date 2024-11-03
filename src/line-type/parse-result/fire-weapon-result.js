"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result";
import WeaponDamageResult from "../../regex/parse-result/weapon-damage-result";
import BaseShipEventResult from "./base-ship-event-result";

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
}

export default FireWeaponResult;