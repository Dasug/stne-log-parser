"use strict";

import ColonyNameAndIdResult from "../regex/parse-result/colony-name-and-id-result.js";
import IndividualColonyStatistics from "./individual-colony-statistics.js";

class ColonyStatistics {
  /**
   * @type {IndividualColonyStatistics[]}
   */
  #colonies = [];
  /**
   * @type {Object.<Number, IndividualColonyStatistics>}
   */
  #coloniesById = {};
  /**
   * @type {Object.<String, IndividualColonyStatistics>}
   */
  #coloniesByName = {};

  /**
   * all colonies mentioned in the processed log(s)
   * @type {IndividualColonyStatistics[]}
   */
  get mentionedColonies() {
    // return shallow copy of colony array
    return this.#colonies.slice();
  }

  /**
   * retrieves statistics about a colony with given id
   * @param {Number} id the colony's id number
   * @returns {?IndividualColonyStatistics} the registered colony with the given ID or null if that colony is not registered
   */
  getColonyById(id) {
    return this.#coloniesById[id] ?? null;
  }

  /**
   * retrieves statistics about a colony with given name
   * @param {String} name the colony's name
   * @returns {?IndividualColonyStatistics} the registered colony with the given name or null if that colony is not registered
   */
  getColonyByName(name) {
    return this.#coloniesByName[name] ?? null;
  }

  #getColonyByParseResult(colonyParseResult) {
    return this.getColonyById(colonyParseResult.id) ?? this.getColonyByName(colonyParseResult.name);
  }

  /**
   * registers or updates a colony to create statistics
   * @param {?ColonyNameAndIdResult} colony - colony to be registered
   * @throws {TypeError} colony must be a valid type
   * @returns {IndividualColonyStatistics} registered or updated colony statistics object
   */
  registerColony(colony) {
    if(colony === null || typeof colony === "undefined") {
      return;
    }
    if(!(colony instanceof ColonyNameAndIdResult)) {
      throw new TypeError("colony is not a valid colony type");
    }

    const colonyAlreadyExists = this.#getColonyByParseResult(colony) !== null;
    let colonyStatisticsObject = this.#getColonyByParseResult(colony) ?? new IndividualColonyStatistics;
    if(!colonyStatisticsObject.hasBasicData()) {
      colonyStatisticsObject._updateColonyDataFromParseResult(colony);
    }

    this.#coloniesById[colony.id] = colonyStatisticsObject;
    
    this.#coloniesByName[colony.name] = colonyStatisticsObject;
    if(!colonyAlreadyExists) {
      this.#colonies.push(colonyStatisticsObject);
    }

    return colonyStatisticsObject;
  }

  constructor() {
  }
}

export default ColonyStatistics;