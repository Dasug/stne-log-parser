"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarPilotManeuverFailureResult {
  /**
   * avatar that triggered the log line
   * @type {AvatarResult}
   */
  avatar;

  /**
   * ship that foiled the maneuver
   * @type {ShipNameAndNccResult}
   */
  target;
}

export default AvatarPilotManeuverFailureResult;