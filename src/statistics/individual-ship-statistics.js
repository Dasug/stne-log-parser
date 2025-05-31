"use strict";

import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import ShipNameOnlyResult from "../regex/parse-result/ship-name-only-result.js";
import IndividualPlayerCharacterStatistics from "./individual-player-character-statistics.js";

class IndividualShipStatistics {
  /**
   * @type {?String}
   */
  #name;
  /**
   * @type {?Number}
   */
  #ncc;
  /**
   * @type {?String}
   */
  #nccPrefix;
  /**
   * @type {?String}
   */
  #shipClass;
  /**
   * @type {?IndividualPlayerCharacterStatistics}
   */
  #owner;
  
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
  get owner() {
    return this.#owner ?? null;
  }

  hasBasicData() {
    return this.name !== null && this.ncc !== null && this.shipClass !== null; 
  }

  /**
   * Updates the ship's NCC
   * Do not use outside of {@link ShipStatistics#updateShipNcc}, as doing so will break the ship registration!
   * If you need to manually update the NCC, use {@link ShipStatistics#updateShipNcc}!
   * @param {Number} ncc new NCC number
   */
  _updateNcc(ncc) {
    this.#ncc = ncc;
  }

  /**
   * updates the ship basic data using a ship parse result
   * Do not use outside of {@link ShipStatistics#registerShip}, as doing so will break the ship registration!
   * If you need to manually update the basic ship data, use {@link ShipStatistics#registerShip}!
   * @param {ShipNameAndNccResult|ShipNameOnlyResult} shipParseResult A parse result for a ship, either only name or with NCC data
   */
  _updateShipDataFromParseResult(shipParseResult) {
    if(shipParseResult instanceof ShipNameAndNccResult) {
      this.#name = shipParseResult.name;
      this.#ncc = shipParseResult.ncc;
      this.#nccPrefix = shipParseResult.nccPrefix;
      this.#shipClass = shipParseResult.shipClass;
    } else if(shipParseResult instanceof ShipNameOnlyResult) {
      this.#name = shipParseResult.name;
    }
  }

  /**
   * Marks the owner of this ship.
   * Does not perform player character registration so make sure the owner is registered first using {@link PlayerCharacterStatistics#registerPlayerCharacter} if you want them to be registered.
   * @param {IndividualPlayerCharacterStatistics} playerCharacter player character that owns this ship
   */
  setOwner(playerCharacter) {
    this.#owner = playerCharacter;
    playerCharacter._addShip(this);
  }
  
  constructor() {

  }
}

export default IndividualShipStatistics;