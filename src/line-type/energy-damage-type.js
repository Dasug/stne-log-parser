"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import EnergyDamageResult from "./parse-result/energy-damage-result.js";
import Statistics from "../statistics/statistics.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import IndividualShipStatistics from "../statistics/individual-ship-statistics.js";

class EnergyDamageType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Hauptenergie\ von\ 
      (?<ship> \g<shipAndNcc>)
      \ sinkt\ um\ 
      (?<energy_damage_amount> \d+(?:[,\.]\d+)?)
      ,\ von\ 
      (?<former_energy_level> \d+(?:[,\.]\d+)?)
      \ auf\ 
      (?<new_energy_level> \d+(?:[,\.]\d+)?)
      (?<ship_got_disabled>,\ und\ fällt\ aus!)?
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?:Main\ energy\ of\ )? 
      (?<ship> \g<shipAndNcc>)
      (?:\ sinks\ by\ |'s\ main\ batteries\ lose\ )
      (?<energy_damage_amount> \d+(?:[,\.]\d+)?)
      (?:
        (?:,\ from\ 
          (?<former_energy_level> \d+(?:[,\.]\d+)?)
          \ to\ 
          (?<new_energy_level> \d+(?:[,\.]\d+)?)
        )
        |
        (?:
        \ energy\ and\ (?<ship_got_disabled> fail).
        )
      )
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const energyDamage = Number(matches.groups.energy_damage_amount.replace(",", "."));
    const disabled = typeof matches.groups.ship_got_disabled !== "undefined";
    let energyBefore;
    if(typeof matches.groups.former_energy_level !== "undefined") {
      energyBefore = Number(matches.groups.former_energy_level.replace(",", "."));
    } else {
      energyBefore = energyDamage; // message part is not present in English message if ship got disabled
    }
    let energyAfter;
    if(typeof matches.groups.new_energy_level !== "undefined") {
      energyAfter = Number(matches.groups.new_energy_level.replace(",", "."));
    } else {
      energyAfter = 0; // message part is not present in English message if ship got disabled
    }
    
    

    const resultObject = new EnergyDamageResult;
    resultObject.ship = ship;
    resultObject.energyDamage = energyDamage;
    resultObject.energyBefore = energyBefore;
    resultObject.remainingEnergy = energyAfter;
    resultObject.shipDisabled = disabled;

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
      LineTag.battle,
      LineTag.weaponShotResult,
      LineTag.damage,
    ];
  }
}

export default EnergyDamageType;