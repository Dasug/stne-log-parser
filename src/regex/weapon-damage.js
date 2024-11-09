"use strict"

import {pattern} from 'regex';
import Expression from './expression.js';
import WeaponDamageResult from './parse-result/weapon-damage-result.js';

/**
 * Parses weapon damage numbers from battle logs.  
 * Examples: `20/0/23`, `120/135/0`  
 * Returns the following named groups when matching:  
 * `shield_damage`: shield damage amount  
 * `hull_damage`: hull damage amount  
 * `energy_damage`: energy damage amount, `undefined` if not specified
 */
class WeaponDamage extends Expression {
  static regexPattern = pattern`
    # shield damage
    (?<shield_damage>\d+)
    (/|\|)
    # hull damage
    (?<hull_damage>\d+)
    (/|\|)
    # energy damage
    (?<energy_damage>\d+)
  `;

  /**
   * @returns {?WeaponDamageResult} player data extracted from the text or null if there's no match
   * @inheritdoc 
   */
  static matchResult(text) {
    const match = this.match(text);
    if(match === null) {
      return null;
    }
    
    const resultObject = new WeaponDamageResult;
    resultObject.shieldDamage = Number(match.groups.shield_damage);
    resultObject.hullDamage = Number(match.groups.hull_damage);
    resultObject.energyDamage = Number(match.groups.energy_damage);
    return resultObject;
  }
}

export default WeaponDamage;