"use strict"

import BuildingType from "../../enum/building-type.js";
import DisplayableRegexResult from "./displayable-regex-result.js";

class BuildingResult extends DisplayableRegexResult {
  /**
   * type of the building
   * @type {BuildingType}
   */
  type;

  /**
   * name of the building if named, null otherwise
   * @type {?string}
   */
  name;

  asDisplayString() {
    if(this.name === null) {
      return this.type.enumKey;
    }
    return String.raw`${this.name} (${this.type.enumKey})`;
  }
}

export default BuildingResult;
