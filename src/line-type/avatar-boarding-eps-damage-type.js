"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarBoardingEpsDamageResult from "./parse-result/avatar-boarding-eps-damage-result.js";
import Statistics from "../statistics/statistics.js";

class AvatarBoardingEpsDamageType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ von\ 
      (?<ship> \g<shipAndNcc>)
      \ beamt\ sich\ mit\ einem\ Außenteam\ an\ Bord\ von\ 
      (?<target> \g<shipAndNcc>)
      \.\ Dort\ zerstören\ sie\ wahlos\ EPS-Relais\ und\ verursachen\ 
      (?<direct_energy_damage> \d+?)
      \ direkten\ Energieverlust,\ 
      (?<countermeasures_energy_damage> \d+?)
      \ für\ Eindämmungsaufgaben\ und\ 
      (?<hull_damage> \d+?)
      \ Hüllenschaden\.
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "avatar": Avatar.asSubroutineDefinition(),
      }
    ),
    // TODO: add regex for English log
  }

  static _buildResultObject(matches) {
    const avatar = Avatar.matchResult(matches.groups.trigger_avatar);
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const target = ShipNameAndNcc.matchResult(matches.groups.target);
    const directEnergyDamage = Number(matches.groups.direct_energy_damage);
    const countermeasuresEnergyDamage = Number(matches.groups.countermeasures_energy_damage);
    const hullDamage = Number(matches.groups.hull_damage);

    const resultObject = new AvatarBoardingEpsDamageResult
    resultObject.ship = ship;
    resultObject.target = target;
    resultObject.avatar = avatar;
    resultObject.directEnergyDamage = directEnergyDamage;
    resultObject.countermeasuresEnergyDamage = countermeasuresEnergyDamage;
    resultObject.hullDamage = hullDamage;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.register(parseResult.ship, parseResult.target);
    
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

export default AvatarBoardingEpsDamageType;