"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarAttackDroneDestructionResult {
  /**
   * avatar that triggered the log line
   * @type {AvatarResult}
   */
  avatar;

  /**
   * ship that is being fired on and destroyed the attack drone
   * @type {ShipNameAndNccResult}
   */
  target;
}

export default AvatarAttackDroneDestructionResult;