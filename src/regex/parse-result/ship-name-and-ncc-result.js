"use strict"

import DisplayableRegexResult from "./displayable-regex-result.js";

class ShipNameAndNccResult extends DisplayableRegexResult {
  /** 
   * name of the ship
   * @type {string}
  */
  name;
  /**
   * ncc of the ship 
   * @type {number}
  */
  ncc;

  /**
   * ncc prefix of the ship or null if empty
   * @type {?string}
   */
  nccPrefix;

  /**
   * class of the ship
   * @type {string}
   */
  shipClass;

  asDisplayString() {
    const nccPrefix = this.nccPrefix !== null ? String.raw`${this.nccPrefix}-` : "";
    return String.raw`${this.name} (${nccPrefix}${this.ncc}, ${this.shipClass})`;
  }
}

export default ShipNameAndNccResult;
