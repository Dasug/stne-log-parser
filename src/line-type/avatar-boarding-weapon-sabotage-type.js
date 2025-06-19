"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import Statistics from "../statistics/statistics.js";
import AvatarBoardingWeaponSabotageResult from "./parse-result/avatar-boarding-weapon-sabotage-result.js";

class AvatarBoardingWeaponSabotageType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ von\ 
      (?<ship> \g<shipAndNcc>)
      \ beamt\ sich\ mit\ einem\ Außenteam\ an\ Bord\ von\ 
      (?<target> \g<shipAndNcc>)
      \.\ Durch\ eine\ geschickte\ Sabotage\ der\ +
      (?<weaponName> .+?)
      ,?\ kann\ der\ gerade\ erfolgte\ Abschuss\ aufgehalten\ werden\ und\ explodiert\ in\ der\ Abschussvorrichtung\ von\ +
      \g<shipAndNcc>
      \.
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
    const weaponName = matches.groups.weaponName;

    const resultObject = new AvatarBoardingWeaponSabotageResult;
    resultObject.ship = ship;
    resultObject.target = target;
    resultObject.avatar = avatar;
    resultObject.weaponName = weaponName;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    const [,, avatar] = statistics.register(parseResult.ship, parseResult.target, parseResult.avatar);

    avatar.registerAction();
    avatar.registerActionSuccess();
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.avatarAction,
      LineTag.avatarActionSuccess,
      
      // this is functionally a weapon shot
      LineTag.weaponShot,
    ];
  }
}

export default AvatarBoardingWeaponSabotageType;