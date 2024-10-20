"use strict"

class PlayerNameAndIdResult {
  /** 
   * player name
   * @type {string}
   */
  name;

  /**
   * player id
   * @type {number}
   */
  id;

  /**
   * player if prefix or null if non existing
   * @type {?string}
   */
  idPrefix;
}

export default PlayerNameAndIdResult;