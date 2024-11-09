"use strict"

import PlayerNameAndId from "../regex/player-name-and-id.js";
import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";
import MapCoordinates from "../regex/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "./tags/line-tag.js";
import DestroyShipResult from "./parse-result/destroy-ship-result.js";

class DestroyShipType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Kontakt\ zu\ 
      (?<ship> \g<shipAndNcc>)
      \ von \ 
      (?<owner> \g<playerAndId>)
      \ verloren!\ Letzte\ bekannte\ Position:\ 
      (?<sector> \g<sectorCoordinates>)
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
      \ (?:from|by) \ 
      (?<owner> \g<playerAndId>)
      \ was\ destroyed\ at\ 
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
    const owner = PlayerNameAndId.matchResult(matches.groups.owner);
    const position = MapCoordinates.matchResult(matches.groups.sector);

    const resultObject = new DestroyShipResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.sector = position;


    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.shipDestruction,
    ];
  }
}

export default DestroyShipType;