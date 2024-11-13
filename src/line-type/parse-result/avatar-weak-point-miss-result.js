"use strict"

import AvatarResult from "../../regex/parse-result/avatar-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarWeakPointMissResult {
  /**
   * avatar that triggered the log line
   * @type {AvatarResult}
   */
  avatar;

  /**
   * opponent ship that was missed
   * @type {ShipNameAndNccResult}
   */
  target;
}

export default AvatarWeakPointMissResult;