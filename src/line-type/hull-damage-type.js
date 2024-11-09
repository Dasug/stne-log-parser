"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "./tags/line-tag.js";
import HullDamageResult from "./parse-result/hull-damage-result.js";

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

  static parse(text, language) {
    if (typeof this._regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return null;
    }
    const matches = text.match(this._regexByLanguage[language]);

    if(matches === null) {
      return null;
    }

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

  static getTags() {
    return [
      LineTag.battle,
      LineTag.weaponShotResult,
      LineTag.damage,
    ];
  }
}

export default HullDamageType;