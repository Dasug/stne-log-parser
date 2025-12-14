"use strict"

import DisplayableRegexResult from "./displayable-regex-result.js";

class ItemResult extends DisplayableRegexResult {
  /** 
   * name of the item
   * @type {string}
  */
  name;
  /**
   * id of the individual item or null if the information is missing
   * @type {?number}
  */
  itemId;

  /**
   * id of the type the item belongs to
   * @type {number}
  */
  itemTypeId;

  asDisplayString() {
    if(this.itemId === null) {
      return String.raw`${this.name} (${this.itemTypeId})`;
    }
    return String.raw`${this.name} (${this.itemId}, ${this.itemTypeId})`;
  }
}

export default ItemResult;
