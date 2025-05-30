"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import ShipNameOnly from '../regex/subroutine/ship-name-only.js'

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import InitializeMainComputerResult from "./parse-result/initialize-main-computer-result.js";
import LineTag from "../../src/enum/line-tag.js";
import Statistics from "../statistics/statistics.js";

class InitializeMainComputerType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>|\g<shipNameOnly>)
      (
        \ von\ 
        (?<owner> \g<playerAndId>)
      )?
      \ +initialisiert\ die\ Startsequenz\ des\ Hauptcomputers!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>|\g<shipNameOnly>)
      (
        \ von\ # this part is in German even in the English log
        (?<owner> \g<playerAndId>)
      )?
      \ +initialises\ the\ boot\ sequence\ of\ the\ main\ computer!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const shipNameAndNccMatch = ShipNameAndNcc.matchResult(matches.groups.ship);
    const ship = shipNameAndNccMatch === null ? ShipNameOnly.matchResult(matches.groups.ship) : shipNameAndNccMatch;
    const owner = typeof matches.groups.owner === "undefined" ? null : PlayerNameAndId.matchResult(matches.groups.owner);

    const resultObject = new InitializeMainComputerResult;
    resultObject.ship = ship;
    resultObject.owner = owner;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ship
    statistics.ships.registerShip(parseResult.ship);
  
    return statistics;
  }

  static getTags() {
    return [
      LineTag.shipMaintenance,
    ];
  }
}

export default InitializeMainComputerType;