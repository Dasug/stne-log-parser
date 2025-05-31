"use strict";

import PlayerNameAndIdResult from "../regex/parse-result/player-name-and-id-result.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import ShipNameOnlyResult from "../regex/parse-result/ship-name-only-result.js";
import IndividualPlayerCharacterStatistics from "./individual-player-character-statistics.js";
import IndividualShipStatistics from "./individual-ship-statistics.js";
import PlayerCharacterStatistics from "./player-character-statistics.js";
import ShipStatistics from "./ship-statistics.js";
/**
 * A parse result of a ship, either with only name or with name and NCC and class
 * @typedef {ShipNameAndNccResult|ShipNameOnlyResult} ShipParseResult
 */

/**
 * A parse result that can be registered in the statistics
 * @typedef {ShipResult|PlayerNameAndIdResult} RegisterableParseResult
 */

/**
 * Statistics object for an individual object
 * @typedef {IndividualPlayerCharacterStatistics|IndividualShipStatistics} IndividualStatisticsObject
 */

class Statistics {
  /**
   * Contains statistics related to ships used in the log(s)
   * @type {ShipStatistics}
   */
  ships;

  /**
   * Contains statistics related to player characters mentioned in the log(s)
   * @type {PlayerCharacterStatistics}
   */
  playerCharacters;

  /**
   * shorthand to register a ship, its owner and the ownership relationship between them.
   * @param {ShipNameAndNccResult|ShipNameOnlyResult|null} ship ship to register
   * @param {?PlayerNameAndIdResult} owner player character to register 
   * @returns {{ship: ?IndividualShipStatistics, owner: ?IndividualPlayerCharacterStatistics}} registered ship and player character objects
   */
  registerShipAndOwner(ship, owner) {
    let shipStatistics = null;
    if(ship instanceof ShipNameAndNccResult || ship instanceof ShipNameOnlyResult) {
      shipStatistics = this.ships.registerShip(ship);
    }

    let ownerStatistics = null;
    if(owner instanceof PlayerNameAndIdResult) {
      ownerStatistics = this.playerCharacters.registerPlayerCharacter(owner);
      shipStatistics.setOwner(ownerStatistics);
    }
    return {ship: shipStatistics, owner: ownerStatistics};
  }

  /**
   * shorthand to register any number of registerable parse result, will be sent to the proper registration functions
   * @param  {...?RegisterableParseResult} parseResultObjects parse result objects to register
   * @returns {(?IndividualStatisticsObject)[]} statistics objects for the registered objects or null if not registerable
   */
  register(...parseResultObjects) {
    return parseResultObjects.map(parseResult => {
      if(parseResult instanceof ShipNameAndNccResult || parseResult instanceof ShipNameOnlyResult) {
        return this.ships.registerShip(parseResult);
      }
      if(parseResult instanceof PlayerNameAndIdResult) {
        return this.playerCharacters.registerPlayerCharacter(parseResult);
      }
      return null;
    });
  }

  constructor() {
    this.ships = new ShipStatistics;
    this.playerCharacters = new PlayerCharacterStatistics;
  }
}

export default Statistics;