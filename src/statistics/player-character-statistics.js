"use strict";

import PlayerNameAndIdResult from "../regex/parse-result/player-name-and-id-result.js";
import IndividualPlayerCharacterStatistics from "./individual-player-character-statistics.js";

class PlayerCharacterStatistics {
  /**
   * @type {IndividualPlayerCharacterStatistics[]}
   */
  #playerCharacters = [];
  /**
   * @type {Object.<Number, IndividualPlayerCharacterStatistics>}
   */
  #playerCharactersById = {};
  /**
   * @type {Object.<String, IndividualPlayerCharacterStatistics>}
   */
  #playerCharactersByName = {};

  /**
   * all player characters mentioned in the processed log(s)
   * @type {IndividualPlayerCharacterStatistics[]}
   */
  get mentionedPlayerCharacters() {
    // return shallow copy of player characters array
    return this.#playerCharacters.slice();
  }

  /**
   * retrieves statistics about a player character with given id
   * @param {Number} id the player character's id
   * @returns {?IndividualPlayerCharacterStatistics} the registered player character with the given ID or null if that player character is not registered
   */
  getPlayerCharacterById(id) {
    return this.#playerCharactersById[id] ?? null;
  }

  /**
   * retrieves statistics about a player character with given name
   * @param {String} name the player character's name
   * @returns {?IndividualPlayerCharacterStatistics} the registered player character with the given name or null if that player character is not registered
   */
  getPlayerCharacterByName(name) {
    return this.#playerCharactersByName[name] ?? null;
  }

  #getCharacterByPlayerNameAndNccResult(playerParseResult) {
    return this.getPlayerCharacterById(playerParseResult.id) ?? this.getPlayerCharacterByName(playerParseResult.name);
  }

  /**
   * registers or updates a player character to create statistics
   * @param {PlayerNameAndIdResult} player player character to be registered
   * @throws {TypeError} player character must be a valid type
   * @returns {IndividualPlayerCharacterStatistics} registered or updated player character statistics object
   */
  registerPlayerCharacter(playerCharacter) {
    if (!(playerCharacter instanceof PlayerNameAndIdResult)) {
      throw new TypeError("player character is not a valid player character parse result");
    }

    const playerAlreadyExists = this.#getCharacterByPlayerNameAndNccResult(playerCharacter) !== null;
    const playerStatisticsObject = this.#getCharacterByPlayerNameAndNccResult(playerCharacter) ?? new IndividualPlayerCharacterStatistics;

    this.#playerCharactersById[playerCharacter.id] = playerStatisticsObject;
    this.#playerCharactersByName[playerCharacter.name] = playerStatisticsObject;
    playerStatisticsObject._updateDataFromParseResult(playerCharacter);
    
    if (!playerAlreadyExists) {
      this.#playerCharacters.push(playerStatisticsObject);
    }

    return playerStatisticsObject;
  }

  constructor() {
  }
}

export default PlayerCharacterStatistics;