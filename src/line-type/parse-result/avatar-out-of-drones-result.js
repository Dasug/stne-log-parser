"use strict"

import DronePilotDroneType from "../../enum/drone-pilot-drone-type.js";
import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ColonyNameAndIdResult from "../../regex/parse-result/colony-name-and-id-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarOutOfDronesResult {
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
   * opposing ship or colony that either fired or was fired upon'
   * @type {ShipNameAndNccResult|ColonyNameAndIdResult}
   */
  opponent;

  /**
   * type of drone the avatar ran out of
   * @type {DronePilotDroneType}
   */
  droneType;
}

export default AvatarOutOfDronesResult;