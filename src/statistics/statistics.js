"use strict";

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

  constructor() {
    this.ships = new ShipStatistics;
    this.playerCharacters = new PlayerCharacterStatistics;
  }
}

export default Statistics;