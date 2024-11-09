"use strict"

import BaseShipEventResult from "./base-ship-event-result.js";

class ChargeWarpcoreResult extends BaseShipEventResult {
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