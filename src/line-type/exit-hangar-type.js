"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import MapCoordinates from "../regex/subroutine/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import HangarMovementResult from "./parse-result/hangar-movement-result.js";
import Statistics from "../statistics/statistics.js";

class ExitHangarType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (
        \ von\ 
        (?<owner> \g<playerAndId>)
      )?
      \ fliegt\ im\ Sektor\ 
      (?<sector> \g<sectorCoordinates>)
      \ aus\ dem\ Hangar\ von \ 
      (?<carrier> \g<shipAndNcc>)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (?:
        \ (?:von|from|by)\ # this part is in German even in the English log
        (?<owner> \g<playerAndId>)
      )?
      \ flies\ out\ of\ the\ hangar\ of\ 
      (?<carrier> \g<shipAndNcc>)
      \ in\ sector\ 
      (?<sector> \g<sectorCoordinates>)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const owner = matches.groups.owner === undefined ? null : PlayerNameAndId.matchResult(matches.groups.owner);
    const sector = MapCoordinates.matchResult(matches.groups.sector);
    const carrier = ShipNameAndNcc.matchResult(matches.groups.carrier);

    const resultObject = new HangarMovementResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.sector = sector;
    resultObject.carrier = carrier;
    resultObject.isEntry = false;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ships
    statistics.ships.registerShip(parseResult.ship);
    statistics.ships.registerShip(parseResult.carrier);

    if(parseResult.owner !== null) {
      statistics.playerCharacters.registerPlayerCharacter(parseResult.owner);
    }
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.shipMovement,
      LineTag.hangar,
    ];
  }
}

export default ExitHangarType;