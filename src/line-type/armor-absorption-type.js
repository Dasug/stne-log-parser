"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "./tags/line-tag.js";
import ArmorAbsorptionResult from "./parse-result/armor-absorption-result.js";

class ArmorAbsorptionType extends GenericType {
  static #regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Panzerung\ von\ 
      (?<ship> \g<shipAndNcc>)
      \ schwächt\ Angriff\ um\ 
      (?<armor_absorption_points> \d+)
      \ Punkte
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      Armor\ of\ 
      (?<ship> \g<shipAndNcc>)
      \ weakens\ the\ attack\ by\ 
      (?<armor_absorption_points> \d+)
      \ points\.
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
    const armorAbsorption = Number(matches.groups.armor_absorption_points);
    

    const resultObject = new ArmorAbsorptionResult;
    resultObject.ship = ship;
    resultObject.armorAbsorption = armorAbsorption;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
    ];
  }
}

export default ArmorAbsorptionType;