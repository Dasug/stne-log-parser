"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarBoardingEpsDamageResult {
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
   * direct energy damage done by the avatar
   * @type {number}
   */
  directEnergyDamage;
  
  /**
   * countermeasure energy damage done by the avatar
   * @type {number}
   */
  countermeasuresEnergyDamage;
  
  /**
   * hull damage done by the avatar
   * @type {number}
   */
  hullDamage;
}

export default AvatarBoardingEpsDamageResult;