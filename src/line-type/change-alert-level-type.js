"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import ShipNameOnly from '../regex/subroutine/ship-name-only.js'

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import ChangeAlertLevelResult from "./parse-result/change-alert-level-result.js";
import LineTag from "../../src/enum/line-tag.js";
import AlertLevel from "../enum/alert-level.js";
import Statistics from "../statistics/statistics.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";

class ChangeAlertLevelType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>|\g<shipNameOnly>)
      (
        \ von\ 
        (?<owner> \g<playerAndId>)
      )?
      \ +geht\ auf\ +
      (?<alert_level> grünen|gelben|roten)
      \ +Alarm
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
      \ +goes\ to\ +
      (?<alert_level> (?:g|G)reen|(?:y|Y)ellow|(?:r|R)ed)
      \ +(?:a|A)lert
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
    const alertLevel = matches.groups.alert_level;

    const resultObject = new ChangeAlertLevelResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    switch(alertLevel.toLowerCase()) {
      case 'grünen':
      case 'green':
        resultObject.alertLevel = AlertLevel.green;
        break;
      case 'gelben':
      case 'yellow':
        resultObject.alertLevel = AlertLevel.yellow;
        break;
      case 'roten':
      case 'red':
        resultObject.alertLevel = AlertLevel.red;
        break;
    }

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ship
    if(parseResult.ship instanceof ShipNameAndNccResult) {
      statistics.ships.registerShip(parseResult.ship);
    }
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.shipMaintenance,
    ];
  }
}

export default ChangeAlertLevelType;