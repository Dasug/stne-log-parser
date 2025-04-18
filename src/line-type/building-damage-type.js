"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import SurfaceCoordinates from "../regex/subroutine/surface-coordinates.js";
import Building from "../regex/subroutine/building.js";
import BuildingDamageResult from "./parse-result/building-damage-result.js";

class BuildingDamageType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<weaponName> .+)
      \ beschädigt\ 
      (?<building> \g<buildingData>)
      \ bei\ Position\ 
      (?<position> \g<surfaceCoordinates>)
      \ um\ 
      (?<damage> \d+)
      \ Schadenspunkte!\ 
      \g<buildingData>
      \ ist\ jetzt\ auf\ 
      (?<remainingHull> \d+)
      \.
      $
      `,
      {
        "surfaceCoordinates": SurfaceCoordinates.asSubroutineDefinition(),
        "buildingData": Building.asSubroutineDefinition(),
      }
    ),
    // Todo: Implement English regex
  }

  static _buildResultObject(matches) {
    const weaponName = matches.groups.weaponName;
    const position = SurfaceCoordinates.matchResult(matches.groups.position);
    const building = Building.matchResult(matches.groups.building);
    const damage = Number(matches.groups.damage);
    const remainingHull = Number(matches.groups.remainingHull);

    const resultObject = new BuildingDamageResult;
    resultObject.weaponName = weaponName;
    resultObject.position = position;
    resultObject.building = building;
    resultObject.remainingHullStrength = remainingHull;
    resultObject.hullDamage = damage;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.weaponShotResult,
    ];
  }
}

export default BuildingDamageType;