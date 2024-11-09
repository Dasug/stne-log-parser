"use strict"

import PlayerNameAndId from "../regex/player-name-and-id.js";
import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";
import MapCoordinates from "../regex/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import UndockingResult from "./parse-result/undocking-result.js";
import LineTag from "./tags/line-tag.js";

class UndockingType extends GenericType {
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
      \ von \ 
      (?<station> \g<shipAndNcc>)
      \ ab$
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
        \ von\ # this part is in German even in the English log
        (?<owner> \g<playerAndId>)
      )?
      \ undocks\ from\ 
      (?<station> \g<shipAndNcc>)
      \ in\ sector\ 
      (?<sector> \g<sectorCoordinates>)
      .$
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    )
  }

  static parse(text, language) {
    if (typeof this._regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return null;
    }
    const matches = text.match(this._regexByLanguage[language]);

    if(matches === null) {
      return null;
    }

    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const owner = matches.groups.owner === undefined ? null : PlayerNameAndId.matchResult(matches.groups.owner);
    const sector = MapCoordinates.matchResult(matches.groups.sector);
    const station = ShipNameAndNcc.matchResult(matches.groups.station);

    const resultObject = new UndockingResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.sector = sector;
    resultObject.station = station;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.shipMovement,
      LineTag.docking,
    ];
  }
}

export default UndockingType;