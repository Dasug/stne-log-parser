"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import Statistics from "../statistics/statistics.js";
import AvatarBoardingRetreatResult from "./parse-result/avatar-boarding-retreat-result.js";

class AvatarBoardingRetreatType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ sieht\ keine\ Chance\ mehr\ seinen\ Auftrag\ zu\ erfüllen\ und\ beamt\ sich\ zurück\ zu\ 
      (?<ship> \g<shipAndNcc>)
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
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    
    const resultObject = new AvatarBoardingRetreatResult;
    resultObject.ship = ship;
    resultObject.avatar = avatar;
    
    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.register(parseResult.ship, parseResult.avatar);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.avatarAction,
      LineTag.avatarActionFailure,
      LineTag.redundant,
    ];
  }
}

export default AvatarBoardingRetreatType;