"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";
import BeamResourceResult from "../../regex/parse-result/beam-resource-result.js";
import BeamItemResult from "../../regex/parse-result/beam-item-result.js";
import BaseShipEventResult from "./base-ship-event-result.js";
import BeamDirection from "../../enum/beam-direction.js";
import ShipNameOnlyResult from "../../regex/parse-result/ship-name-only-result.js";

class BeamResult extends BaseShipEventResult {
  /**
   * ncc of the ship that triggered the beam log line.
   * this information is sometimes available even when the ship is an ShipNameOnlyResult
   * @type {?number}
   */
  shipNcc;
  
  /**
   * name of the ship that received the resources or got the resources transported from
   * @type {ShipNameAndNccResult|ShipNameOnlyResult}
   */
  beamTarget;

  /**
   * sector the log line occured in
   * @type {MapCoordinatesResult}
   */
  sector;

  /**
   * direction the beam took place in (from or to target)
   * @type {BeamDirection}
   */
  beamDirection;

  /**
   * resources and amounts that were transfered
   * @type {BeamResourceResult[]}
   */
  resources;

  /**
   * items that were transfered
   * @type {BeamItemResult[]}
   */
  items;

}

export default BeamResult;