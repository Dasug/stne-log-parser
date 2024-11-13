"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarDecoyDroneSuccessResult {
  /**
   * avatar that triggered the log line
   * @type {AvatarResult}
   */
  avatar;

  /**
   * ship the avatar is based on and that is being fired on
   * @type {ShipNameAndNccResult}
   */
  ship;

  /**
   * ship that tried firing on the avatar's ship
   * @type {ShipNameAndNccResult}
   */
  opponent;

  /**
   * name of the fired weapon
   * @type {string}
   */
  weapon;
}

export default AvatarDecoyDroneSuccessResult;