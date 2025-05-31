"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import ActivateWeaponsResult from "./parse-result/activate-weapons-result.js";
import WeaponsState from "../enum/weapons-state.js";
import Statistics from "../statistics/statistics.js";

class ActivateWeaponsType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (
        \ von\ 
        (?<owner> \g<playerAndId>)
      )?
      \ +
      (?<disable> de)?
      aktiviert\ die\ Waffensysteme
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (
        \ (?:von|by|from)\ # this part is in German even in the English log
        (?<owner> \g<playerAndId>)
      )?
      \ +
      (?<disable> de)?
      activates\ its\ weapons\ systems
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const owner = matches.groups.owner === undefined ? null : PlayerNameAndId.matchResult(matches.groups.owner);
    const state = ["de"].includes(matches.groups.disable) ? WeaponsState.inactive : WeaponsState.active;

    const resultObject = new ActivateWeaponsResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.state = state;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.registerShipAndOwner(parseResult.ship, parseResult.owner);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.shipMaintenance,
    ];
  }
}

export default ActivateWeaponsType;