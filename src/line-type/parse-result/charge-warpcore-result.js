"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result";
import PlayerNameAndIdResult from "../../regex/parse-result/player-name-and-id-result";

class ChargeWarpcoreResult {
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

  /**
   * amount of warpcore energy that is being charged
   * @type {Number}
   */
  chargeAmount;

  /**
   * warpcore level after charging
   * @type {Number}
   */
  warpcoreState;
}

export default ChargeWarpcoreResult;