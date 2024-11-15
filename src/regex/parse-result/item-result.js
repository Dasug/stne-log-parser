"use strict"

import AvatarJob from "../../enum/avatar-job.js";

class ItemResult {
  /** 
   * name of the item
   * @type {string}
  */
  name;
  /**
   * id of the individual item or null if the information is missing
   * @type {?number}
  */
  itemId;

  /**
   * id of the type the item belongs to
   * @type {number}
  */
  itemTypeId;
}

export default ItemResult;