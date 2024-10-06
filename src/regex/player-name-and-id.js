"use strict"

import {pattern} from 'regex';
import Expression from './expression';

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
    \ \(
    # player id prefix if existing
    ((?<id_prefix>[a-zA-Z0-9]+)-)?
    # player id
    (?<player_id>\d+)
    \)
  `;
}

export default PlayerNameAndId;