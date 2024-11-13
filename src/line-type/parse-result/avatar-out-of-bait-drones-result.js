"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarOutOfBaitDronesResult {
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

  /**
   * ship that's being fired upon'
   * @type {ShipNameAndNccResult}
   */
  target;
}

export default AvatarOutOfBaitDronesResult;