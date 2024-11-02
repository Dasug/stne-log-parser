"use strict"

import PlayerNameAndId from "../regex/player-name-and-id";
import ShipNameAndNcc from "../regex/ship-name-and-ncc";
import MapCoordinates from "../regex/map-coordinates";

import { addSubroutines } from "../util/regex-helper";
import GenericType from "./generic-type";
import { pattern } from "regex";
import UndockingResult from "./parse-result/undocking-result";

class UndockingType extends GenericType {
  static #regexByLanguage = {
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

  static detect(text, language) {
    if (typeof this.#regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return false;
    }
    return text.match(this.#regexByLanguage[language]) !== null;
  }

  static parse(text, language) {
    if (typeof this.#regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return null;
    }
    const matches = text.match(this.#regexByLanguage[language]);

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
      "ship_movement",
      "docking"
    ];
  }
}

export default UndockingType;