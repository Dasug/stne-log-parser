"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarAttackDroneCritResult {
  /**
   * avatar that triggered the log line
   * @type {AvatarResult}
   */
  avatar;

  /**
   * ship that is being fired on
   * @type {ShipNameAndNccResult}
   */
  target;
}

export default AvatarAttackDroneCritResult;