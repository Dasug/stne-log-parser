"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarBoardingInterceptedResult {
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
   * ship the avatar beamed themself onto
   * @type {ShipNameAndNccResult}
   */
  target;
  
  /**
   * avatar intercepting the boarding avatar
   * @type {AvatarResult}
   */
  interceptingAvatar;
}

export default AvatarBoardingInterceptedResult;