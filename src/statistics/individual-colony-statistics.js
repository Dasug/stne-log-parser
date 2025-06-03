"use strict"

import ColonyNameAndIdResult from "../regex/parse-result/colony-name-and-id-result.js";

class IndividualColonyStatistics {
  /**
   * name of the colony
   * @type {String}
   */
  #name;
  /**
   * id of the colony
   * @type {Number}
   */
  #id;

  /**
   * name of the colony
   * @type {String}
   */
  get name() {
    return this.#name ?? null;
  }
  /**
   * id of the colony
   * @type {Number}
   */
  get id() {
    return this.#id ?? null;
  }

  /**
   * does the colony have basic data (name and id)?
   * @type {boolean}
   */
  hasBasicData() {
    return this.name !== null && this.id !== null;
  }

  /**
   * updates the colony's basic data using a colony name and ID parse result
   * Do not use outside of {@link ColonyStatistics#registerColony}, as doing so will break the colony registration!
   * If you need to manually update the basic ship data, use {@link ColonyStatistics#registerColony}!
   * @param {ColonyNameAndIdResult} colony - A parse result for a colony
   */
  _updateColonyDataFromParseResult(colony) {
    this.#id = colony.id;
    this.#name = colony.name;
  }
}

export default IndividualColonyStatistics;