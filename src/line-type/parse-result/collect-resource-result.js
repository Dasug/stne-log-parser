"use strict"

import Resource from "../../enum/resource.js";
import BaseShipEventResult from "./base-ship-event-result.js";

class CollectResourceResult extends BaseShipEventResult {
  /**
   * resource that was collected
   * @type {Resource}
   */
  resource;
  
  /**
   * amount of the resource that was collected
   * @type {Number}
   */
  amount;
}

export default CollectResourceResult;