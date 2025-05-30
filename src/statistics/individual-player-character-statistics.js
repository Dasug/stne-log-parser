"use strict";

import PlayerNameAndIdResult from "../regex/parse-result/player-name-and-id-result.js";

class IndividualPlayerCharacterStatistics {
  #name;
  #id;
  #idPrefix;
  
  get name() {
    return this.#name ?? null;
  }
  get id() {
    return this.#id ?? null;
  }
  get idPrefix() {
    return this.#idPrefix ?? null;
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
  
  constructor() {
  }
}

export default IndividualPlayerCharacterStatistics;