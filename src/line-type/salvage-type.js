"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import SalvageResult from "./parse-result/salvage-result.js";
import Statistics from "../statistics/statistics.js";

class SalvageType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Es\ wurden\ 
      (?<resources> \d+)
      \ Waren\ von\ 
      (?<debris> \g<shipAndNcc>)
      \ für\ 
      (?<energy> \d+(,\d+)?)
      \ Energie\ extrahiert!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    // TODO: add English regex
  }

  static _buildResultObject(matches) {
    const debris = ShipNameAndNcc.matchResult(matches.groups.debris);
    const resources = Number(matches.groups.resources);
    const energy = Number(String(matches.groups.energy).replaceAll(",", "."));

    const resultObject = new SalvageResult;
    resultObject.debrisField = debris;
    resultObject.resourcesExtracted = resources;
    resultObject.energyUsed = energy;
    
    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ship
    statistics.ships.registerShip(parseResult.debrisField);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.economy,
    ];
  }
}

export default SalvageType;