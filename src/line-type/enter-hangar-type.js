"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import MapCoordinates from "../regex/subroutine/map-coordinates.js";
import ShipNameOnly from "../regex/subroutine/ship-name-only.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import HangarMovementResult from "./parse-result/hangar-movement-result.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import ShipNameOnlyResult from "../regex/parse-result/ship-name-only-result.js";

class EnterHangarType extends GenericType {
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
      \ in\ den\ Hangar\ von \ 
      (?<carrier> \g<shipNameOnly>)
      \ ein$
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
        \ (?:von|from|by)\ # this part is in German even in the English log
        (?<owner> \g<playerAndId>)
      )?
      \ enters\ the\ hangar\ of\ 
      (?<carrier> \g<shipNameOnly>)
      \ in\ sector\ 
      (?<sector> \g<sectorCoordinates>)
      \.?
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
    const carrier = ShipNameOnly.matchResult(matches.groups.carrier);

    const resultObject = new HangarMovementResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.sector = sector;
    resultObject.carrier = carrier;
    resultObject.isEntry = true;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ships
    if(parseResult.ship instanceof ShipNameAndNccResult) {
      statistics.ships.registerShip(parseResult.ship);
    }
    if(parseResult.carrier instanceof ShipNameAndNccResult || parseResult.carrier instanceof ShipNameOnlyResult) {
      statistics.ships.registerShip(parseResult.carrier);
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

export default EnterHangarType;