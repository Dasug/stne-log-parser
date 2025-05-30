"use strict";

import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import ShipNameOnlyResult from "../regex/parse-result/ship-name-only-result.js";

class IndividualShipStatistics {
  #name;
  #ncc;
  #nccPrefix;
  #shipClass;
  
  get name() {
    return this.#name ?? null;
  }
  get ncc() {
    return this.#ncc ?? null;
  }
  get nccPrefix() {
    return this.#nccPrefix ?? null;
  }
  get shipClass() {
    return this.#shipClass ?? null;
  }

  hasBasicData() {
    return this.name !== null && this.ncc !== null && this.shipClass !== null; 
  }

  /**
   * updates the ship basic data using a ship parse result
   * @param {ShipNameAndNccResult|ShipNameOnlyResult} shipParseResult A parse result for a ship, either only name or with NCC data
   */
  updateShipDataFromParseResult(shipParseResult) {
    if(shipParseResult instanceof ShipNameAndNccResult) {
      this.#name = shipParseResult.name;
      this.#ncc = shipParseResult.ncc;
      this.#nccPrefix = shipParseResult.nccPrefix;
      this.#shipClass = shipParseResult.shipClass;
    } else if(shipParseResult instanceof ShipNameOnlyResult) {
      this.#name = shipParseResult.name;
    }
  }
  
  constructor() {

  }
}

export default IndividualShipStatistics;