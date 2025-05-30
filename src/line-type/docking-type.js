"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import MapCoordinates from "../regex/subroutine/map-coordinates.js";
import ShipNameOnly from "../regex/subroutine/ship-name-only.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import DockingResult from "./parse-result/docking-result.js";
import LineTag from "../../src/enum/line-tag.js";
import Statistics from "../statistics/statistics.js";

class DockingType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (
        \ von\ 
        (?<owner> \g<playerAndId>)
      )?
      \ dockt\ im\ Sektor\ 
      (?<sector> \g<sectorCoordinates>)
      \ an \ 
      (?<station> \g<shipNameOnly>)
      \ an$
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (?:
        \ von\ # this part is in German even in the English log
        (?<owner> \g<playerAndId>)
      )?
      \ docks\ to\ 
      (?<station> \g<shipNameOnly>)
      \ in\ sector\ 
      (?<sector> \g<sectorCoordinates>)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const owner = matches.groups.owner === undefined ? null : PlayerNameAndId.matchResult(matches.groups.owner);
    const sector = MapCoordinates.matchResult(matches.groups.sector);
    const station = ShipNameOnly.matchResult(matches.groups.station);

    const resultObject = new DockingResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.sector = sector;
    resultObject.station = station;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ships
    statistics.ships.registerShip(parseResult.ship);
    statistics.ships.registerShip(parseResult.station);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.shipMovement,
      LineTag.docking,
    ];
  }
}

export default DockingType;