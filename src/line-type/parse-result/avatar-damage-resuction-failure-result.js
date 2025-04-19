"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ColonyNameAndIdResult from "../../regex/parse-result/colony-name-and-id-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarDamageReductionFailureResult {
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
}

export default AvatarDamageReductionFailureResult;