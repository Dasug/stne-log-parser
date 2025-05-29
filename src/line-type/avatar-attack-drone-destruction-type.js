"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarAttackDroneDestructionResult from "./parse-result/avatar-attack-drone-destruction-result.js";

class AvatarAttackDroneDestructionType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<target> \g<shipAndNcc>)
      \ zerstört\ die\ Angriffsdrohne\ von\ 
      (?<trigger_avatar> \g<avatar>)
      \ durch\ gezieltes\ Abwehrfeuer!
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
    
    const resultObject = new AvatarAttackDroneDestructionResult;
    resultObject.target = target;
    resultObject.avatar = avatar;
    
    return resultObject;
  }
  
  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ship
    statistics.ships.registerShip(parseResult.target);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.avatarActionFailure,
    ];
  }
}

export default AvatarAttackDroneDestructionType;