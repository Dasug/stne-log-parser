"use strict"

import {pattern} from 'regex';
import Expression from './expression.js';
import ColonyNameAndIdResult from '../parse-result/colony-name-and-id-result.js';

/**
 * Parses a player name with ID and an optional ID prefix.  
 * Examples: `[]U.C.W[] Scorga Empire (34108)`, `Ferengi (NPC-5)`  
 * Returns the following named groups when matching:  
 * `player_name`: name of the player  
 * `id_prefix`: ID prefixes like NPC, ADMIN, etc. if present  
 * `player_id`: id of the player
 */
class ColonyNameAndId extends Expression {
  static regexPattern = pattern`
    # colony name
    (?<colony_name>.+)
    \ \(
    # colony id
    (?<colony_id>\d+)
    \)
  `;

  /**
   * @returns {?ColonyNameAndIdResult} player data extracted from the text or null if there's no match
   * @inheritdoc 
   */
  static matchResult(text) {
    const match = this.match(text);
    if(match === null) {
      return null;
    }
    
    const resultObject = new ColonyNameAndIdResult;
    resultObject.name = match.groups.colony_name;
    resultObject.id = Number(match.groups.colony_id);
    return resultObject;
  }
}

export default ColonyNameAndId;