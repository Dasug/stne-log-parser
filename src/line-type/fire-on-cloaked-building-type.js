"use strict"

import GenericType from "./generic-type.js";
import LineTag from "../../src/enum/line-tag.js";
import AtmoshpereAbsorptionResult from "./parse-result/atmosphere-absorption-result.js";
import { regex } from "regex";

class FireOnCloakedBuildingType extends GenericType {
  static _regexByLanguage = {
    "de": regex`
      ^
      (?<weapon_name> .+)
      \ feuert\ auf\ das\ Ziel\ mit\ einer\ Stärke\ von\  
      (?<weapon_strength> \d+)
      !
      $
      `,
  }

  static _buildResultObject(matches) {
    const weaponName = matches.groups.weapon_name;
    const weaponStrength = Number(matches.groups.weapon_strength);

    const resultObject = new AtmoshpereAbsorptionResult;
    resultObject.weaponStrength = weaponStrength;
    resultObject.weaponName = weaponName;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.weaponShotResult,
    ];
  }
}

export default FireOnCloakedBuildingType;
