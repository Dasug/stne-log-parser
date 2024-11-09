"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";
import PlayerNameAndIdResult from "../../regex/parse-result/player-name-and-id-result.js";

class BaseShipEventResult {
  /**
   * ship that triggered the log
   * @type {ShipNameAndNccResult}
   */
  ship;

  /**
   * owner of the ship that triggered the log, can be null if not included
   * @type {?PlayerNameAndIdResult}
   */
  owner;
}

export default BaseShipEventResult;