"use strict"

import HideStatus from "../../enum/hide-status.js";
import MapFieldType from "../../enum/map-field-type.js";
import MapCoordinatesResult from "../../regex/parse-result/map-coordinates-result.js";
import PlayerNameAndIdResult from "../../regex/parse-result/player-name-and-id-result.js";
import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class HideResult {
  /**
   * ship whose hull was hit
   * @type {ShipNameAndNccResult}
   */
  ship;

  /**
   * owner of the hiding ship
   * @type {PlayerNameAndIdResult}
   */
  owner;

  /**
   * hide status
   * is the ship hiding or reappearing?
   * @type {HideStatus}
   */
  state;

  /**
   * sector the ship is hiding in
   * @type {MapCoordinatesResult}
   */
  sector;

  /**
   * the type of field the ship is hiding on
   * @type {MapFieldType}
   */
  fieldType;
}

export default HideResult;