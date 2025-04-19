"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class SalvageResult {
  /**
   * debris field where ressources were salvaged from 
   * @type {ShipNameAndNccResult}
   */
  debrisField;

  /**
   * number of resources that were extracted
   * @type {number}
   */
  resourcesExtracted;

  /**
   * amount of energy used for the salvage operation
   * @type {number}
   */
  energyUsed;
}

export default SalvageResult;