"use strict"

class ShipNameAndNccResult {
  /** 
   * name of the ship
   * @type {string}
  */
  name;
  /**
   * ncc of the ship 
   * @type {number}
  */
  ncc;

  /**
   * ncc prefix of the ship or null if empty
   * @type {?string}
   */
  nccPrefix;

  /**
   * class of the ship
   * @type {string}
   */
  shipClass;
}

export default ShipNameAndNccResult;