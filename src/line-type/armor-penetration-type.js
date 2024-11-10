"use strict"

import GenericType from "./generic-type.js";
import { regex } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import ArmorPenetrationResult from "./parse-result/armor-penetration-result.js";

class ArmorPenetrationType extends GenericType {
  static _regexByLanguage = {
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

  static _buildResultObject(matches) {
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