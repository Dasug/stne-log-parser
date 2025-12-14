"use strict"

import DisplayableRegexResult from "./displayable-regex-result.js";

class ShipNameOnlyResult extends DisplayableRegexResult {
  /**
   * ship name
   * @type {string}
   */
  name;

  asDisplayString() {
    return this.name;
  }
}

export default ShipNameOnlyResult;
