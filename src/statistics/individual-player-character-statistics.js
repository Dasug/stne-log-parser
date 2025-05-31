"use strict";

import PlayerNameAndIdResult from "../regex/parse-result/player-name-and-id-result.js";
import IndividualShipStatistics from "./individual-ship-statistics.js";

class IndividualPlayerCharacterStatistics {
  /**
   * @type {?String}
   */
  #name;
  /**
   * @type {?Number}
   */
  #id;
  /**
   * @type {?String}
   */
  #idPrefix;
  /**
   * @type {IndividualShipStatistics[]}
   */
  #ships = [];

  get name() {
    return this.#name ?? null;
  }
  get id() {
    return this.#id ?? null;
  }
  get idPrefix() {
    return this.#idPrefix ?? null;
  }
  get ships() {
    // return a shallow copy to prevent modification
    return this.#ships.slice();
  }

  /**
   * updates the player basic data using a player data parse result
   * Do not use outside of {@link PlayerCharacterStatistics#registerPlayerCharacter}, as doing so will break the player character registration!
   * If you need to manually update the basic character data, use {@link PlayerCharacterStatistics#registerPlayerCharacter}!
   * @param {PlayerNameAndIdResult} playerParseResult A parse result for a player
   */
  _updateDataFromParseResult(playerParseResult) {
    this.#name = playerParseResult.name;
    this.#id = playerParseResult.id;
    this.#idPrefix = playerParseResult.idPrefix;
  }

  /**
   * Add ship to a user.
   * Do not use outside of {@link IndividualShipStatistics#setOwner}. Doing so will break the two-way link!
   * @param {IndividualShipStatistics} ship Ship to add to this user
   */
  _addShip(ship) {
    if(this.#ships.findIndex(s => {
      if(s.ncc === null) {
        return s.name === ship.name;
      }
      return s.ncc === ship.ncc;
    }) !== -1) {
      // ship already in list, skipping
      return;
    }

    this.#ships.push(ship);
  }
  
  constructor() {
  }
}

export default IndividualPlayerCharacterStatistics;