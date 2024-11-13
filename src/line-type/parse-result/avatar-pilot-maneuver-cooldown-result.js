"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarPilotManeuverCooldownResult {
  /**
   * avatar that triggered the log line
   * @type {AvatarResult}
   */
  avatar;

  /**
   * ship that would have been targeted by the maneuver
   * @type {ShipNameAndNccResult}
   */
  target;
}

export default AvatarPilotManeuverCooldownResult;