"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc";

import { addSubroutines } from "../util/regex-helper";
import GenericType from "./generic-type";
import { pattern } from "regex";
import LineTag from "./tags/line-tag";
import ShotMissedResult from "./parse-result/shot-missed-result";

class ShotMissedType extends GenericType {
  static #regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ verfehlt\ das\ Ziel!
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
      \ misses\ its\ target!
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
    

    const resultObject = new ShotMissedResult;
    resultObject.ship = ship; 

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.weaponShotResult,
    ];
  }
}

export default ShotMissedType;