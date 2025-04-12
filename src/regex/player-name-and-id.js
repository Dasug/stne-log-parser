"use strict"

import {pattern} from 'regex';
import Expression from './expression.js';
import PlayerNameAndIdResult from './parse-result/player-name-and-id-result.js';

/**
 * Parses a player name with ID and an optional ID prefix.  
 * Examples: `[]U.C.W[] Scorga Empire (34108)`, `Ferengi (NPC-5)`  
 * Returns the following named groups when matching:  
 * `player_name`: name of the player  
 * `id_prefix`: ID prefixes like NPC, ADMIN, etc. if present  
 * `player_id`: id of the player
 */
class PlayerNameAndId extends Expression {
  static regexPattern = pattern`
    # player name
    (?<player_name>.+)
    \s+\(
    # player id prefix if existing
    ((?<id_prefix>[a-zA-Z0-9]+)-)?
    # player id
    (?<player_id>\d+)
    \)
  `;

  /**
   * @returns {?PlayerNameAndIdResult} player data extracted from the text or null if there's no match
   * @inheritdoc 
   */
  static matchResult(text) {
    const match = this.match(text);
    if(match === null) {
      return null;
    }
    
    const resultObject = new PlayerNameAndIdResult;
    resultObject.name = match.groups.player_name;
    resultObject.idPrefix = match.groups.id_prefix !== undefined ? match.groups.id_prefix : null;
    resultObject.id = Number(match.groups.player_id);
    return resultObject;
  }
}

export default PlayerNameAndId;