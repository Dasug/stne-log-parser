"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarBoardingWeaponSabotageResult {
  /**
   * avatar that triggered the log line
   * @type {AvatarResult}
   */
  avatar;

  /**
   * ship the avatar is based on
   * @type {ShipNameAndNccResult}
   */
  ship;

  /**
   * ship the avatar sabotaged
   * @type {ShipNameAndNccResult}
   */
  target;
  
  /**
   * name of the sabotages weapon
   * @type {string}
   */
  weaponName;
}

export default AvatarBoardingWeaponSabotageResult;