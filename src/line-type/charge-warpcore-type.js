"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import ChargeWarpcoreResult from "./parse-result/charge-warpcore-result.js";
import LineTag from "../../src/enum/line-tag.js";
import Statistics from "../statistics/statistics.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";

class ChargeWarpcoreType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (
        \ von\ 
        (?<owner> \g<playerAndId>)
      )?
      \ ? # there is a double space here occasionally
      \ hat\ den\ Warpkern\ um\ 
      (?<charge_amount> \d+(?:(?:,|.)\d+)?)
      \ auf \ 
      (?<warpcore_state> \d+(?:(?:,|.)\d+)?)
      \ aufgeladen$
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
        \ von\ # this part is in German even in the English log
        (?<owner> \g<playerAndId>)
      )?
      \ ? # there is a double space here occasionally
      \ has\ charged\ its\ warp\ core\ by\ 
      (?<charge_amount> \d+(?:(?:,|.)\d+)?)
      \ up\ to \ 
      (?<warpcore_state> \d+(?:(?:,|.)\d+)?)
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
    const chargeAmount = parseFloat(matches.groups.charge_amount.replace(",", "."));
    const warpcoreState = parseFloat(matches.groups.warpcore_state.replace(",", "."));

    const resultObject = new ChargeWarpcoreResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.chargeAmount = chargeAmount;
    resultObject.warpcoreState = warpcoreState;

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

export default ChargeWarpcoreType;