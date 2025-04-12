"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import MapCoordinates from "../regex/subroutine/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import ShipNameOnly from "../regex/subroutine/ship-name-only.js";
import ColonyNameAndId from "../regex/subroutine/colony-name-and-id.js";
import EnterOrbitResult from "./parse-result/enter-orbit-result.js";
import OrbitEntryDirection from "../enum/orbit-entry-direction.js";

class EnterOrbitType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>|\g<shipNameOnly>)
      (?:
        \ von \ 
        (?<owner> \g<playerAndId>)
      )?
      \ ist\ 
      (?:in\ den|aus\ dem)
      \ Orbit\ von\ 
      (?<colony> \g<colonyNameAndId>)
      \ bei\ 
      (?<sector> \g<sectorCoordinates>)
      \ 
      (?<direction>eingeflogen|ausgetreten)
      \.
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "colonyNameAndId": ColonyNameAndId.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    ),
    // TODO: add English pattern
  }

  static _buildResultObject(matches) {
    const shipWithNccMatch = ShipNameAndNcc.matchResult(matches.groups.ship);
    const ship = shipWithNccMatch !== null ? shipWithNccMatch : ShipNameOnly.matchResult(matches.groups.ship);
    const owner = typeof matches.groups.owner === "undefined" ? null : PlayerNameAndId.matchResult(matches.groups.owner);
    const sector = MapCoordinates.matchResult(matches.groups.sector);
    const colony = ColonyNameAndId.matchResult(matches.groups.colony);

    const resultObject = new EnterOrbitResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.sector = sector;
    resultObject.colony = colony;
    resultObject.direction = ["ausgetreten"].includes(matches.groups.direction) ? OrbitEntryDirection.exit : OrbitEntryDirection.entry;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.shipMovement,
    ];
  }
}

export default EnterOrbitType;