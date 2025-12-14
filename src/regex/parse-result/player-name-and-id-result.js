"use strict"

import DisplayableRegexResult from "./displayable-regex-result.js";

class PlayerNameAndIdResult extends DisplayableRegexResult {
  /** 
   * player name
   * @type {string}
   */
  name;

  /**
   * player id
   * @type {number}
   */
  id;

  /**
   * player if prefix or null if non existing
   * @type {?string}
   */
  idPrefix;

  asDisplayString() {
    const idPrefix = this.idPrefix !== null ? String.raw`${this.idPrefix}-` : "";
    return String.raw`${this.name} (${idPrefix}${this.id})`;
  }
}

export default PlayerNameAndIdResult;
