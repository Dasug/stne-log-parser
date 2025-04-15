"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ColonyNameAndIdResult from "../../regex/parse-result/colony-name-and-id-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarWeaponDamageIncreaseResult {
  /**
   * avatar that triggered the log line
   * @type {AvatarResult}
   */
  avatar;

  /**
   * ship or colony that fired the shot
   * @type {ShipNameAndNccResult|ColonyNameAndIdResult}
   */
  origin;

  /**
   * ship that is being fired on
   * @type {ShipNameAndNccResult|ColonyNameAndIdResult}
   */
  target;
  
  /**
   * percentage of weapon damage increase due to the avatar action
   * @type {number}
   */
  damageIncrease;
}

export default AvatarWeaponDamageIncreaseResult;