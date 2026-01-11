"use strict"

import GenericType from "./generic-type.js";
import LineTag from "../../src/enum/line-tag.js";
import AtmoshpereAbsorptionResult from "./parse-result/atmosphere-absorption-result.js";
import { regex } from "regex";

class AtmosphereAbsorptionType extends GenericType {
  static _regexByLanguage = {
    "de": regex`
      ^
      Die\ Atmosphäre\ schwächt\ die\ Stärke\ der\ 
      (?<weapon_name> .+)
      \ um\ 
      (?<armor_absorption_points> \d+)
      \.
      $
      `,
  }

  static _buildResultObject(matches) {
    const weaponName = matches.groups.weapon_name;
    const atmosphereAbsorption = Number(matches.groups.armor_absorption_points);

    const resultObject = new AtmoshpereAbsorptionResult;
    resultObject.atmosphereAbsorption = atmosphereAbsorption;
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

export default AtmosphereAbsorptionType;
