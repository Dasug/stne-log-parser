"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import MapCoordinates from "../regex/subroutine/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import HideStatus from "../enum/hide-status.js";
import HideResult from "./parse-result/hide-result.js";
import MapFieldType from "../enum/map-field-type.js";
import Statistics from "../statistics/statistics.js";

class HideType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ von\ 
      (?<owner> \g<playerNameAndId>)
      \ 
      (?:versteckt\ sich|taucht\ aus\ dem\ Versteck)
      \ bei\ 
      (?<sector> \g<sectorCoordinates>)
      \ in \ 
      (?<fieldType> Großes\ Asteroidenfeld|Dichter\ Deuterium-Nebel)
      \ ?
      (?<state> auf)?$
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
        "playerNameAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    ),
    // TODO: add English regex
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const sector = MapCoordinates.matchResult(matches.groups.sector);
    const owner = PlayerNameAndId.matchResult(matches.groups.owner);
    const state = ["auf"].includes(matches.groups.state) ? HideStatus.visible : HideStatus.hidden;
    const fieldTypeString = matches.groups.fieldType;
    let fieldType = MapFieldType.unknown;
    switch(fieldTypeString) {
      case "Großes Asteroidenfeld":
        fieldType = MapFieldType.largeAsteroidField;
        break;
      case "Dichter Deuterium-Nebel":
        fieldType = MapFieldType.denseDeuteriumNebula;
        break;
    }


    const resultObject = new HideResult;
    resultObject.ship = ship;
    resultObject.sector = sector;
    resultObject.state = state;
    resultObject.owner = owner;
    resultObject.fieldType = fieldType;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ship
    statistics.ships.registerShip(parseResult.ship);

    if(parseResult.owner !== null) {
      statistics.playerCharacters.registerPlayerCharacter(parseResult.owner);
    }
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.shipMaintenance,
    ];
  }
}

export default HideType;