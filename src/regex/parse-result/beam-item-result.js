"use strict"

import DisplayableRegexResult from "./displayable-regex-result.js";
import ItemResult from "./item-result.js";

class BeamItemResult extends DisplayableRegexResult {
  /**
   * item that was transfered
   * @type {ItemResult}
   */
  item;

  /**
   * number of items that were transfered
   * @type {number}
   */
  amount;

  asDisplayString() {
    return String.raw`${this.amount} ${this.item.asDisplayString()}`;
  }
}

export default BeamItemResult;
