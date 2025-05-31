"use strict";

import PlayerNameAndIdResult from "../regex/parse-result/player-name-and-id-result.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import ShipNameOnlyResult from "../regex/parse-result/ship-name-only-result.js";
import IndividualPlayerCharacterStatistics from "./individual-player-character-statistics.js";
import IndividualShipStatistics from "./individual-ship-statistics.js";
import PlayerCharacterStatistics from "./player-character-statistics.js";
import ShipStatistics from "./ship-statistics.js";

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

  constructor() {
    this.ships = new ShipStatistics;
    this.playerCharacters = new PlayerCharacterStatistics;
  }
}

export default Statistics;