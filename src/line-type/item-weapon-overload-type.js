"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import ItemWeaponOverloadResult from "./parse-result/item-weapon-overload-result.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import Statistics from "../statistics/statistics.js";

class ItemWeaponOverloadType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Waffenüberladung\ überlädt\ die\ Waffensysteme\ mit\ einem\ kurzen\ Energiestoß,\ 
      wodurch\ sich\ die\ Angriffskraft\ gegen\ 
      (?<target> \g<shipAndNcc>)
      \ um\ 
      (?<damageIncrease> \d+(?:,\d+)?)
      %\ erhöht!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    // TODO: add English regex
  }

  static _buildResultObject(matches) {
    const target = ShipNameAndNcc.matchResult(matches.groups.target);
    const damageIncrease = Number(matches.groups.damageIncrease);
    
    const resultObject = new ItemWeaponOverloadResult;
    resultObject.target = target;
    resultObject.damageIncrease = damageIncrease;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ship
    if(parseResult.target instanceof ShipNameAndNccResult) {
      statistics.ships.registerShip(parseResult.target);
    }
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.item,
    ];
  }
}

export default ItemWeaponOverloadType;