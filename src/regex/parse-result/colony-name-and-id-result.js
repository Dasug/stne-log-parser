"use strict"

import DisplayableRegexResult from "./displayable-regex-result.js";

class ColonyNameAndIdResult extends DisplayableRegexResult {
  /** 
   * colony name
   * @type {string}
   */
  name;

  /**
   * colony id
   * @type {number}
   */
  id;

  asDisplayString() {
    return String.raw`${this.name} (${this.id})`;
  }
}

export default ColonyNameAndIdResult;
