"use strict"

import ShipNameOnly from '../regex/ship-name-only.js'

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import MapCoordinates from "../regex/map-coordinates.js";
import TractorBeamResult from "./parse-result/tractor-beam-result.js";

class TractorBeamReleaseType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipNameOnly>)
      \ löst\ in\ Sektor\ ?\(
      (?<sector> \g<sectorCoordinates>)
      \)\ bei\ 
      (?<target> \g<shipNameOnly>)
      \ den\ Traktorstrahl\.
      $
      `,
      {
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    ),
    // TODO: Add English regex
  }

  static _buildResultObject(matches) {
    const ship = ShipNameOnly.matchResult(matches.groups.ship);
    const target = ShipNameOnly.matchResult(matches.groups.target);
    const sector = MapCoordinates.matchResult(matches.groups.sector);

    const resultObject = new TractorBeamResult;
    resultObject.ship = ship;
    resultObject.target = target;
    resultObject.sector = sector;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.tractorBeam,
    ];
  }
}

export default TractorBeamReleaseType;