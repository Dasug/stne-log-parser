"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import EnvironmentCeruleanResult from "./parse-result/environment-cerulean-result.js";
import Statistics from "../statistics/statistics.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";

class EnvironmentCeruleanType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ verliert\ 
      (?<energyLoss> \d+(?:,\d+)?)
      \ Energie\ durch\ die\ Einwirkung\ eines\ 
      Cerule?anischen # e is missing in the original log message, added it here in case they ever fix the typo
      \ Nebels!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    // TODO: add English pattern
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const energyLoss = Number(matches.groups.energyLoss.replaceAll(",", "."));

    const resultObject = new EnvironmentCeruleanResult;
    resultObject.ship = ship;
    resultObject.energyLoss = energyLoss;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.register(parseResult.ship);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.shipMovement,
      LineTag.environmentEffect,
    ];
  }
}

export default EnvironmentCeruleanType;