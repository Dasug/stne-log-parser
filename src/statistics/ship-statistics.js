"use strict";

import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import ShipNameOnlyResult from "../regex/parse-result/ship-name-only-result.js";
import IndividualShipStatistics from "./individual-ship-statistics.js";

class ShipStatistics {
  /**
   * @type {IndividualShipStatistics[]}
   */
  #ships = [];
  /**
   * @type {Object.<Number, IndividualShipStatistics>}
   */
  #shipsByNcc = {};
  /**
   * @type {Object.<String, IndividualShipStatistics>}
   */
  #shipsByName = {};

  /**
   * all ships mentioned in the processed log(s)
   * @type {IndividualShipStatistics[]}
   */
  get mentionedShips() {
    // return shallow copy of ships array
    return this.#ships.slice();
  }

  get destroyedShips() {
    return this.#ships.filter(ship => ship.isDestroyed);
  }

  /**
   * checks if ship with given NCC is known
   * @param {Number} ncc the ship's NCC number
   * @returns {boolean} whether ship with this NCC has been registered
   */
  isShipNccKnown(ncc) {
    return typeof this.#shipsByNcc[ncc] !== "undefined";
  }

  /**
   * retrieves statistics about a ship with given NCC
   * @param {Number} ncc the ship's NCC number
   * @returns {?IndividualShipStatistics} the registered ship with the given NCC or null if that ship is not registered
   */
  getShipByNcc(ncc) {
    return this.#shipsByNcc[ncc] ?? null;
  }

  /**
   * checks if ship with given name is known
   * @param {String} name the ship's name
   * @returns {boolean} whether ship with this name has been registered
   */
  isShipNameKnown(name) {
    return typeof this.#shipsByName[name] !== "undefined";
  }

  /**
   * retrieves statistics about a ship with given name
   * @param {String} name the ship's name
   * @returns {?IndividualShipStatistics} the registered ship with the given name or null if that ship is not registered
   */
  getShipByName(name) {
    return this.#shipsByName[name] ?? null;
  }

  #getShipByShipNameAndNccResult(shipParseResult) {
    return this.getShipByNcc(shipParseResult.ncc) ?? this.getShipByName(shipParseResult.name);
  }

  #getShipByParseResult(shipParseResult) {
    if(shipParseResult instanceof ShipNameAndNccResult) {
      return this.#getShipByShipNameAndNccResult(shipParseResult);
    }
    if(shipParseResult instanceof ShipNameOnlyResult) {
      return this.getShipByName(shipParseResult.name);
    }
    throw new TypeError("ship is not a valid ship parse result");
  }

  /**
   * registers or updates a ship to create statistics
   * @param {ShipNameAndNccResult|ShipNameOnlyResult|null} ship Ship to be registered
   * @throws {TypeError} Ship must be a valid type
   * @returns {IndividualShipStatistics} registered or updates ship statistics object
   */
  registerShip(ship) {
    if(ship === null || typeof ship === "undefined") {
      return;
    }
    if(!(ship instanceof ShipNameAndNccResult) && !(ship instanceof ShipNameOnlyResult)) {
      throw new TypeError("ship is not a valid ship type");
    }

    const shipAlreadyExists = this.#getShipByParseResult(ship) !== null;
    let shipStatisticsObject = this.#getShipByParseResult(ship) ?? new IndividualShipStatistics;
    if(!shipStatisticsObject.hasBasicData()) {
      shipStatisticsObject._updateShipDataFromParseResult(ship);
    }

    if(ship instanceof ShipNameAndNccResult) {
      this.#shipsByNcc[ship.ncc] = shipStatisticsObject;
    }
    
    this.#shipsByName[ship.name] = shipStatisticsObject;
    if(!shipAlreadyExists) {
      this.#ships.push(shipStatisticsObject);
    }

    return shipStatisticsObject;
  }

  /**
   * Updates a ship object with an externally collected NCC number and adjust ship dictionary
   * @param {IndividualShipStatistics} shipStatisticsObject ship object to update
   * @param {Number} ncc NCC number to add to ship
   */
  updateShipNcc(shipStatisticsObject, ncc) {
    if(shipStatisticsObject.ncc !== null) {
      delete this.#shipsByNcc[shipStatisticsObject.ncc];
    }
    this.#shipsByNcc[ncc] = shipStatisticsObject;
    shipStatisticsObject._updateNcc(ncc);
  }

  constructor() {
  }
}

export default ShipStatistics;