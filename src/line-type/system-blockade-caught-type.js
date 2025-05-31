"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import SystemBlockadeCaughtResult from "./parse-result/system-blockade-caught-result.js";
import Statistics from "../statistics/statistics.js";

class SystemBlockadeCaughtType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Antrieb\ von\ 
      (?<ship> \g<shipAndNcc>)
      \ erhitzt,\ durch\ die\ Systemblockade,\ um\ 
      (?<flightRangeLoss>\d+(?:,\d+)?)
      !
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    // TODO: add English regex
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const flightRangeLoss = Number(matches.groups.flightRangeLoss.replaceAll(",", "."));

    const resultObject = new SystemBlockadeCaughtResult;
    resultObject.ship = ship;
    resultObject.flightRangeLoss = flightRangeLoss;

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
      LineTag.systemBlockade,
    ];
  }
}

export default SystemBlockadeCaughtType;