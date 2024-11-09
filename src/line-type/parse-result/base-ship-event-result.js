"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";
import PlayerNameAndIdResult from "../../regex/parse-result/player-name-and-id-result.js";
import ShipNameOnlyResult from "../../regex/parse-result/ship-name-only-result.js";

class BaseShipEventResult {
  /**
   * ship that triggered the log
   * often ship name only in logbook sent folder
   * @type {ShipNameAndNccResult|ShipNameOnlyResult}
   */
  ship;

  /**
   * owner of the ship that triggered the log, can be null if not included
   * @type {?PlayerNameAndIdResult}
   */
  owner;
}

export default BaseShipEventResult;