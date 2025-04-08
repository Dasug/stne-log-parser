"use strict"

import WeaponsState from "../../enum/weapons-state.js";
import BaseShipEventResult from "./base-ship-event-result.js";

class ActivateWeaponsResult extends BaseShipEventResult {
  /**
   * state of the weapons
   * @type {WeaponsState}
   */
  state;
}

export default ActivateWeaponsResult;