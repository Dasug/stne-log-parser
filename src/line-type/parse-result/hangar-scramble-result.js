"use strict"

import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class HangarScrambleResult {
  /** 
   * carrier that triggered the scramble
   * @type {ShipNameAndNccResult}
  */
  ship;

  /**
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;
}

export default HangarScrambleResult;