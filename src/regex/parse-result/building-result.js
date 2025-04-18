"use strict"

import BuildingType from "../../enum/building-type.js";

class BuildingResult {
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
}

export default BuildingResult;