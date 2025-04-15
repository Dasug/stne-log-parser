"use strict"

import ShipNameAndNccResult from "../../regex/parse-result/ship-name-and-ncc-result.js";

class ItemWeaponOverloadResult {
  /**
   * target of the shot this item triggered on
   * @type {ShipNameAndNccResult}
   */
  target;

  /**
   * percentage of damage increase caused by the item
   * @type {number}
   */
  damageIncrease;
}

export default ItemWeaponOverloadResult;