"use strict"

import PlayerNameAndId from "../regex/player-name-and-id.js";
import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";
import MapCoordinates from "../regex/map-coordinates.js";
import ShipNameOnly from "../regex/ship-name-only.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import EnterMovementResult from "./parse-result/enter-movement-result.js";

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

    const resultObject = new EnterMovementResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.sector = sector;
    resultObject.carrier = carrier;
    resultObject.isEntry = true;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.shipMovement,
      LineTag.hangar,
    ];
  }
}

export default EnterHangarType;