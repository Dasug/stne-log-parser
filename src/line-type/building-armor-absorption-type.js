"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import SurfaceCoordinates from "../regex/subroutine/surface-coordinates.js";
import BuildingArmorAbsorptionResult from "./parse-result/building-armor-absorption-result.js";

class BuildingArmorAbsorptionType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Die\ Panzerung\ des\ Gebäudes\ an\ Position\ 
      (?<position> \g<surfaceCoordinates>)
      \ schwächt\ die\ Stärke\ der\ 
      (?<weapon_name> .+)
      \ um\ 
      (?<armor_absorption_points> \d+)
      \ auf\ 
      (?<weapon_remaining_points> \d+)
      \ Punkte\ ab.
      $
      `,
      {
        "surfaceCoordinates": SurfaceCoordinates.asSubroutineDefinition(),
      }
    ),
    // Todo: Implement English regex
  }

  static _buildResultObject(matches) {
    const armorAbsorption = Number(matches.groups.armor_absorption_points);
    const weaponRemaining = Number(matches.groups.weapon_remaining_points);
    const weaponName = matches.groups.weapon_name;
    const position = SurfaceCoordinates.matchResult(matches.groups.position); 

    const resultObject = new BuildingArmorAbsorptionResult;
    resultObject.armorAbsorption = armorAbsorption;
    resultObject.weaponStrengthRemaining = weaponRemaining;
    resultObject.weaponName = weaponName;
    resultObject.position = position;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
    ];
  }
}

export default BuildingArmorAbsorptionType;