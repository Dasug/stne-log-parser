"use strict"

import ShipNameOnly from '../regex/subroutine/ship-name-only.js'

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import MapCoordinates from "../regex/subroutine/map-coordinates.js";
import TractorBeamResult from "./parse-result/tractor-beam-result.js";
import Statistics from '../statistics/statistics.js';

class TractorBeamLockType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipNameOnly>)
      \ erfasst\ in\ Sektor\ ?\(
      (?<sector> \g<sectorCoordinates>)
      \)\ die\ 
      (?<target> \g<shipNameOnly>)
      \ mit\ einem\ Traktorstrahl\.
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

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.register(parseResult.ship, parseResult.target);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.tractorBeam,
    ];
  }
}

export default TractorBeamLockType;