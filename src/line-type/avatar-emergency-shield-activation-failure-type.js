"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarEmergencyShieldActivationFailureResult from "./parse-result/avatar-emergency-shield-activation-failure-result.js";
import Statistics from "../statistics/statistics.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarEmergencyShieldActivationFailureType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ an\ Bord\ von\ 
      (?<ship> \g<shipAndNcc>)
      \ bemerkt\ die\ drohnende\ Gefahr\ zu\ spät\ und\ schafft\ es\ nicht\ rechtzeitig\ die\ Schilde\ zu\ aktivieren!
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
    
    const resultObject = new AvatarEmergencyShieldActivationFailureResult;
    resultObject.avatar = avatar;
    resultObject.ship = ship;
    
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
      LineTag.avatarAction,
      LineTag.avatarActionFailure,
    ];
  }
}

export default AvatarEmergencyShieldActivationFailureType;