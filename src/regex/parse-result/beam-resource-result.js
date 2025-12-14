"use strict"

import BeamResource from "../../enum/beam-resource.js";
import DisplayableRegexResult from "./displayable-regex-result.js";

class BeamResourceResult extends DisplayableRegexResult {
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

  asDisplayString() {
    return String.raw`${this.amount} ${this.resource.enumKey}`;
  }
}

export default BeamResourceResult;
