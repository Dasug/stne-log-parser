"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarDamageReductionFailureResult {
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
}

export default AvatarDamageReductionFailureResult;