"use strict"

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result";
import PlayerNameAndIdResult from "../../regex/parse-result/player-name-and-id-result";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result";

class SectorEntryResult {
  /**
   * ship that triggered the log
   * @type {ShipNameAndNccResult}
   */
  ship;

  /**
   * owner of the ship that triggered the log
   * @type {PlayerNameAndIdResult}
   */
  owner;

  /**
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;
}

export default SectorEntryResult;