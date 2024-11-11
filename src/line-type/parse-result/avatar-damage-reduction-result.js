"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarDamageReductionResult {
  /**
   * avatar that triggered the log line
   * @type {AvatarResult}
   */
  avatar;

  /**
   * ship that fired the shot
   * @type {ShipNameAndNccResult}
   */
  ship;

  /**
   * ship that is being fired on
   * @type {ShipNameAndNccResult}
   */
  target;
  
  /**
   * percentage of weapon damage reduction due to the avatar action
   * @type {number}
   */
  damageReduction;
}

export default AvatarDamageReductionResult;