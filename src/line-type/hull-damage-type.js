"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import HullDamageResult from "./parse-result/hull-damage-result.js";
import Statistics from "../statistics/statistics.js";

class HullDamageType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ nimmt\ 
      (?<hull_damage_amount> \d+)
      (?:\(\+(?<overkill_damage> \d+)\))?
      \ Schaden,\ Hüllenintegrität\ sinkt\ auf\ 
      (?<remaining_hull_strength> \d+)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ takes\ 
      (?<hull_damage_amount> \d+)
      (?:\(\+(?<overkill_damage> \d+)\))?
      \ damage,\ hull\ integrity\ is\ reduced\ to\ 
      (?<remaining_hull_strength> \d+)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const hullDamage = Number(matches.groups.hull_damage_amount);
    const hullStrength = Number(matches.groups.remaining_hull_strength);
    const overkillDamage = typeof matches.groups.overkill_damage !== "undefined" ? Number(matches.groups.overkill_damage) : 0;
    
    

    const resultObject = new HullDamageResult;
    resultObject.ship = ship;
    resultObject.hullDamage = hullDamage;
    resultObject.remainingHullStrength = hullStrength;
    resultObject.overkillDamage = overkillDamage;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.register(parseResult.ship);
    
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

export default HullDamageType;