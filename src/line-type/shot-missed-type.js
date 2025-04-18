"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import ShotMissedResult from "./parse-result/shot-missed-result.js";
import Building from "../regex/subroutine/building.js";

class ShotMissedType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?:
        (?<ship> \g<shipAndNcc>)
        |
        (?<building> \g<buildingData>)
      )
      \ verfehlt\ das\ Ziel!
      $
      `,
      {
        "buildingData": Building.asSubroutineDefinition(),
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?:
        (?<ship> \g<shipAndNcc>)
        |
        (?<building> \g<buildingData>)
      )
      \ misses\ its\ target!
      $
      `,
      {
        "buildingData": Building.asSubroutineDefinition(),
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const building = Building.matchResult(matches.groups.building);
    
    const resultObject = new ShotMissedResult;
    resultObject.origin = ship ?? building; 

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