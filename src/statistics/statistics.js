"use strict";

import ShipStatistics from "./ship-statistics.js";

class Statistics {
  /**
   * Contains statistics related to ships used in the log(s)
   * @type {ShipStatistics}
   */
  ships;

  constructor() {
    this.ships = new ShipStatistics;
  }
}

export default Statistics;