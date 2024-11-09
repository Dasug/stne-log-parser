"use strict"

import GenericType from "./generic-type.js";
import { regex } from "regex";
import LineTag from "./tags/line-tag.js";
import ArmorPenetrationResult from "./parse-result/armor-penetration-result.js";

class ArmorPenetrationType extends GenericType {
  static #regexByLanguage = {
    "de": regex`
      ^
      (?<armor_penetration_points> \d+)
      \ Panzerung\ durchdrungen\.
      $
    `,
    "en": regex`
      ^
      Penetrated\ 
      (?<armor_penetration_points> \d+)
      \ points\ of\ armor\.
      $
    `,
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

    const armorPenetration = Number(matches.groups.armor_penetration_points);
    

    const resultObject = new ArmorPenetrationResult;
    resultObject.armorPenetration = armorPenetration;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
    ];
  }
}

export default ArmorPenetrationType;