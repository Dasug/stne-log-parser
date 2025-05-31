"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarDamageReductionFailureResult from "./parse-result/avatar-damage-resuction-failure-result.js";
import ColonyNameAndId from "../regex/subroutine/colony-name-and-id.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import Statistics from "../statistics/statistics.js";

class AvatarDamageReductionFailureType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ versucht\ die\ Zielerfassung\ von\ 
      (?:
        (?<ship> \g<shipAndNcc>)
        |
        (?<colony> \g<colonyNameAndId>)
      )
      \ zu\ stören,\ hat\ damit\ aber\ keinerlei\ Erfolg!
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
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const colony = ColonyNameAndId.matchResult(matches.groups.colony);

    const resultObject = new AvatarDamageReductionFailureResult;
    resultObject.origin = ship ?? colony;
    resultObject.avatar = avatar;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.register(parseResult.origin);
    
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

export default AvatarDamageReductionFailureType;