"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import MapCoordinates from "../regex/subroutine/map-coordinates.js";
import HangarScrambleResult from "./parse-result/hangar-scramble-result.js";

class HangarScrambleType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ löst\ in\ Sektor\ 
      (?<sector> \g<mapCoordinates>)
      \ Angriffsalarm\ im\ Hangarbereich\ aus!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "mapCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    ),
    // TODO: add English regex
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const sector = MapCoordinates.matchResult(matches.groups.sector);
    
    const resultObject = new HangarScrambleResult;
    resultObject.ship = ship;
    resultObject.sector = sector;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.hangar,
    ];
  }
}

export default HangarScrambleType;