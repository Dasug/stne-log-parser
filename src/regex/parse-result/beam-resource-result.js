"use strict"

import BeamResource from "../../enum/beam-resource.js";

class BeamResourceResult {
  /**
   * resource that was transfered
   * @type {BeamResource}
   */
  resource;

  /**
   * number of resources that were transfered
   * @type {number}
   */
  amount;
}

export default BeamResourceResult;