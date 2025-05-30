"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import ShieldDamageResult from "./parse-result/shield-damage-result.js";
import Statistics from "../statistics/statistics.js";

class ShieldDamageType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Schilde\ von\ 
      (?<ship> \g<shipAndNcc>)
      \ nehmen\ 
      (?<shield_damage_amount> \d+)
      \ Schaden
      (?:,\ sind\ jetzt\ auf\ 
      (?<remaining_shield_strength> \d+)
      |
      \ und\ (?<shields_collapse> kollabieren))
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      Shields\ of\ 
      (?<ship> \g<shipAndNcc>)
      \ take\ 
      (?<shield_damage_amount> \d+)
      \ damage
      (?:,\ shield\ strength\ is\ now\ at\ 
      (?<remaining_shield_strength> \d+)
      |
      \ and\ (?<shields_collapse> collapse))
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const shieldDamage = Number(matches.groups.shield_damage_amount);
    const shieldStrength = typeof matches.groups.remaining_shield_strength !== "undefined" ? Number(matches.groups.remaining_shield_strength) : 0;
    const shieldsCollapsed = typeof matches.groups.shields_collapse !== "undefined" ? true : false;
    

    const resultObject = new ShieldDamageResult;
    resultObject.ship = ship;
    resultObject.shieldDamage = shieldDamage;
    resultObject.remainingShieldStrength = shieldStrength;
    resultObject.shieldsCollapsed = shieldsCollapsed;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ship
    statistics.ships.registerShip(parseResult.ship);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.weaponShotResult,
      LineTag.damage,
    ];
  }
}

export default ShieldDamageType;