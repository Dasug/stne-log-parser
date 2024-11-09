"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "./tags/line-tag.js";
import ShieldDamageResult from "./parse-result/shield-damage-result.js";

class ShieldDamageType extends GenericType {
  static #regexByLanguage = {
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

  static detect(text, language) {
    if (typeof this.#regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return false;
    }
    return text.match(this.#regexByLanguage[language]) !== null;
  }

  static parse(text, language) {
    if (typeof this.#regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return null;
    }
    const matches = text.match(this.#regexByLanguage[language]);

    if(matches === null) {
      return null;
    }

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

  static getTags() {
    return [
      LineTag.battle,
      LineTag.weaponShotResult,
      LineTag.damage,
    ];
  }
}

export default ShieldDamageType;