"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarWeaponDamageIncreaseResult from "./parse-result/avatar-weapon-damage-increase-result.js";
import ColonyNameAndId from "../regex/subroutine/colony-name-and-id.js";
import Statistics from "../statistics/statistics.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarWeaponDamageIncreaseType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ zielt\ auf\ 
      (?:ein\ kritisches\ Untersystem|eine\ Schwachstelle)
      \ wodurch\ der\ Angriff\ von \ 
      (?<origin> \g<shipAndNcc>|\g<colonyNameAndId>)
      \ gegen\ 
      (?<target> \g<shipAndNcc>|\g<colonyNameAndId>)
      \ um \ 
      (?<damage_increase> \d+?)%
      \ stärker\ ausfällt!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "colonyNameAndId": ColonyNameAndId.asSubroutineDefinition(),
        "avatar": Avatar.asSubroutineDefinition(),
      }
    ),
    // TODO: add regex for English log
  }

  static _buildResultObject(matches) {
    const avatar = Avatar.matchResult(matches.groups.trigger_avatar);
    const origin = ShipNameAndNcc.matchResult(matches.groups.origin) ?? ColonyNameAndId.matchResult(matches.groups.origin);
    const target = ShipNameAndNcc.matchResult(matches.groups.target) ?? ColonyNameAndId.matchResult(matches.groups.target);
    const damageIncrease = Number(matches.groups.damage_increase);

    const resultObject = new AvatarWeaponDamageIncreaseResult;
    resultObject.origin = origin;
    resultObject.target = target;
    resultObject.avatar = avatar;
    resultObject.damageIncrease = damageIncrease;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.register(parseResult.origin, parseResult.target);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.avatarAction,
      LineTag.avatarActionSuccess,
    ];
  }
}

export default AvatarWeaponDamageIncreaseType;