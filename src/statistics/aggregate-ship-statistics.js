import { mapObject } from "../util/object-helper.js";
import IndividualShipStatistics from "./individual-ship-statistics.js";

class AggregateShipStatistics extends IndividualShipStatistics {
  static #organizeShipsByOwner(ships) {
    const shipsByOwner = {};
    ships.forEach(ship => {
      const ownerKey = ship.owner?.id ?? ship.owner?.name;
      if(typeof shipsByOwner[ownerKey] === "undefined") {
        shipsByOwner[ownerKey] = [];
      }
      shipsByOwner[ownerKey].push(ship);
    });

    return shipsByOwner;
  }

  /**
   * @param {IndividualShipStatistics[]} ships ships to organize
   * @param {string} attribute attribute name to organize by
   * @returns {Object.<string,IndividualShipStatistics>}
   */
  static #organizeShipsByAttribute(ships, attribute) {
    const shipsByAttribute = {};
    ships.forEach(ship => {
      const attributeKey = ship[attribute];
      if(typeof shipsByAttribute[attributeKey] === "undefined") {
        shipsByAttribute[attributeKey] = [];
      }
      shipsByAttribute[attributeKey].push(ship);
    });

    return shipsByAttribute;
  }

  /**
   * Aggregate statistics by player
   * @param {IndividualShipStatistics[]} ships ships to aggregate statistics
   * @returns {Object.<string, AggregateShipStatistics>}
   */
  static aggregateByPlayer(ships) {
    const shipsByOwner = this.#organizeShipsByOwner(ships);

    const aggregates = {};
    for(const [owner, ownerShips] of Object.entries(shipsByOwner)) {
      aggregates[owner] = ownerShips.reduce((aggregate, ship) => aggregate.mergeShipData(ship), new AggregateShipStatistics);
    };

    return aggregates;
  }

  /**
   * Aggregate statistics by player and ship class
   * @param {IndividualShipStatistics[]} ships ships to aggregate statistics
   * @returns {Object.<string, Object.<string, AggregateShipStatistics>>}
   */
  static aggregateByPlayerAndShipClass(ships) {
    const shipsByOwner = this.#organizeShipsByOwner(ships);
    const shipsByOwnerAndClass = mapObject(shipsByOwner, shipList => this.#organizeShipsByAttribute(shipList, "shipClass"));

    const aggregates = {};
    for(const [owner, ownerClasses] of Object.entries(shipsByOwnerAndClass)) {
      aggregates[owner] = {};
      for(const [shipClass, shipClassShips] of Object.entries(ownerClasses)) {
        aggregates[owner][shipClass] = shipClassShips.reduce((aggregate, ship) => aggregate.mergeShipData(ship), new AggregateShipStatistics);
      }
    };

    return aggregates;
  }
}

export default AggregateShipStatistics;
