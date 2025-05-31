"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarPilotManeuverCooldownResult from "./parse-result/avatar-pilot-maneuver-cooldown-result.js";
import Statistics from "../statistics/statistics.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarPilotManeuverCooldownType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ kann\ kein\ 2\.\ Manöver,\ so\ kurz\ nach\ dem\ 1\.\ durchführen\.\ 
      Er\ kann\ jetzt\ nichts\ tun\ um\ den\ Angriff\ gegen\ 
      (?<target> \g<shipAndNcc>)
      \ zu\ verstärken!
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
    
    const resultObject = new AvatarPilotManeuverCooldownResult;
    resultObject.target = target;
    resultObject.avatar = avatar;
    
    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.register(parseResult.target);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.avatarActionFailure,
    ];
  }
}

export default AvatarPilotManeuverCooldownType;