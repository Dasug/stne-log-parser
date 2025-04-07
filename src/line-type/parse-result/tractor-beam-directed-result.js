"use strict"

import PlayerNameAndIdResult from "../../regex/parse-result/player-name-and-id-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class TractorBeamDirectedResult {
  /**
   * ship the tractor beam is directed at
   * @type {ShipNameAndNccResult}
   */
  target;

  /**
   * owner of the target ship
   * @type {PlayerNameAndIdResult}
   */
  targetOwner;
}

export default TractorBeamDirectedResult;