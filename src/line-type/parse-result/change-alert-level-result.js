"use strict"

import AlertLevel from "../../enum/alert-level.js";
import BaseShipEventResult from "./base-ship-event-result.js";

class ChangeAlertLevelResult extends BaseShipEventResult {
  /**
   * alert level that was changed to
   * @type {AlertLevel}
   */
  alertLevel;
}

export default ChangeAlertLevelResult;