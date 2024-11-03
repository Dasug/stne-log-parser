"use strict"

import PlayerNameAndId from "../regex/player-name-and-id";
import ShipNameAndNcc from "../regex/ship-name-and-ncc";
import MapCoordinates from "../regex/map-coordinates";

import { addSubroutines } from "../util/regex-helper";
import GenericType from "./generic-type";
import { pattern } from "regex";
import SectorEntryResult from "./parse-result/sector-entry-result";
import LineTag from "./tags/line-tag";

class SectorEntryType extends GenericType {
  static #regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ von \ 
      (?<owner> \g<playerAndId>)
      \ ist\ in\ Sektor\ 
      (?<sector> \g<sectorCoordinates>)
      \ eingeflogen$
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
      \ von\ # this line is in German in the log for some reason...
      (?<owner> \g<playerAndId>)
      \ has\ entered\ sector\ 
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
    const owner = PlayerNameAndId.matchResult(matches.groups.owner);
    const sector = MapCoordinates.matchResult(matches.groups.sector);

    const resultObject = new SectorEntryResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.sector = sector;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.shipMovement,
    ];
  }
}

export default SectorEntryType;