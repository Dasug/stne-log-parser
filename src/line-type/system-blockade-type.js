"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import MapCoordinates from "../regex/subroutine/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import SystemBlockadeResult from "./parse-result/system-blockade-result.js";
import SystemBlockadeState from "../enum/system-blockade-state.js";
import Statistics from "../statistics/statistics.js";

class SystemBlockadeType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ hat\ im\ Sektor\ 
      (?<sector> \g<sectorCoordinates>)
      \ 
      (?:eine|die)
      \ Systemblockade\ 
      (?<state> errichtet|aufgegeben)$
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    ),
    // TODO: add English regex
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const sector = MapCoordinates.matchResult(matches.groups.sector);
    const state = ["errichtet"].includes(matches.groups.state) ? SystemBlockadeState.raised : SystemBlockadeState.dropped;

    const resultObject = new SystemBlockadeResult;
    resultObject.ship = ship;
    resultObject.sector = sector;
    resultObject.state = state;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.register(parseResult.ship);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.shipMaintenance,
      LineTag.systemBlockade,
    ];
  }
}

export default SystemBlockadeType;