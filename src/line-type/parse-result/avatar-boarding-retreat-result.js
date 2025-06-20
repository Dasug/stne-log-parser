"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarBoardingRetreatResult {
  /**
   * avatar that triggered the log line
   * @type {AvatarResult}
   */
  avatar;

  /**
   * ship the avatar is returning to
   * @type {ShipNameAndNccResult}
   */
  ship;
}

export default AvatarBoardingRetreatResult;