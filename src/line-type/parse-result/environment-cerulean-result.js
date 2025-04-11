"use strict";

import ShipNameAndNcc from "../../regex/ship-name-and-ncc.js";

class EnvironmentCeruleanResult {
  /**
   * ship that is affected by the cerulean nebula
   * @type {ShipNameAndNcc}
   */
  ship;

  /**
   * energy lost by the ship
   * @type {number}
   */
  energyLoss;
}

export default EnvironmentCeruleanResult;