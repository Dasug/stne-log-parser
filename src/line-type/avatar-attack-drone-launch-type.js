"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarAttackDroneLaunchResult from "./parse-result/avatar-attack-drone-launch-result.js";
import Statistics from "../statistics/statistics.js";

class AvatarAttackDroneLaunchType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ setzt\ eine\ Angriffsdrohne\ ein\ und\ stürzt\ sie\ auf\ 
      (?<target> \g<shipAndNcc>)
      !
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
    const target = ShipNameAndNcc.matchResult(matches.groups.target);
    
    const resultObject = new AvatarAttackDroneLaunchResult;
    resultObject.target = target;
    resultObject.avatar = avatar;
    
    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    const [, avatar] = statistics.register(parseResult.target, parseResult.avatar);
    
    avatar.registerAction();
    return statistics;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.avatarAction,
    ];
  }
}

export default AvatarAttackDroneLaunchType;