"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import ArmorAbsorptionResult from "./parse-result/armor-absorption-result.js";
import Statistics from "../statistics/statistics.js";

class ArmorAbsorptionType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Panzerung\ von\ 
      (?<ship> \g<shipAndNcc>)
      \ schwächt\ Angriff\ um\ 
      (?<armor_absorption_points> \d+)
      \ Punkte
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      Armor\ of\ 
      (?<ship> \g<shipAndNcc>)
      \ weakens\ the\ attack\ by\ 
      (?<armor_absorption_points> \d+)
      \ points\.
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const armorAbsorption = Number(matches.groups.armor_absorption_points);
    

    const resultObject = new ArmorAbsorptionResult;
    resultObject.ship = ship;
    resultObject.armorAbsorption = armorAbsorption;

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
      LineTag.battle,
    ];
  }
}

export default ArmorAbsorptionType;