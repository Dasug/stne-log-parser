"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarPilotManeuverSuccessResult {
  /**
   * avatar that triggered the log line
   * @type {AvatarResult}
   */
  avatar;

  /**
   * ship that got outplayed by the maneuver
   * @type {ShipNameAndNccResult}
   */
  target;

  /**
   * ship that the avatar is based on
   * @type {ShipNameAndNccResult}
   */
  ship;
}

export default AvatarPilotManeuverSuccessResult;