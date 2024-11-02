"use strict"

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result";
import PlayerNameAndIdResult from "../../regex/parse-result/player-name-and-id-result";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result";

class UndockingResult {
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
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;

  /** 
   * station the ships is undocking from
   * @type {ShipNameAndNccResult}
  */
  station;
}

export default UndockingResult;