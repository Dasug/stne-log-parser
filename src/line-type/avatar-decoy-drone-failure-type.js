"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import ColonyNameAndId from "../regex/subroutine/colony-name-and-id.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarDecoyDroneFailureResult from "./parse-result/avatar-decoy-drone-failure-result.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import Statistics from "../statistics/statistics.js";

class AvatarDecoyDroneFailureType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ setzt\ eine\ Köderdrohne\ ein,\ kann\ die\ Zielerfassung\ von\ 
      (?<opponent> \g<shipAndNcc>|\g<colonyNameAndId>)
      \ beim\ Angriff\ auf\  
      (?<ship> \g<shipAndNcc>)
      \ aber\ nicht\ täuschen!
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
    const opponentShip = ShipNameAndNcc.matchResult(matches.groups.opponent);
    const colonyOpponent = ColonyNameAndId.matchResult(matches.groups.opponent);
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    
    const resultObject = new AvatarDecoyDroneFailureResult;
    resultObject.avatar = avatar;
    resultObject.opponent = opponentShip ?? colonyOpponent;
    resultObject.ship = ship;
    
    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    const [,, avatar] = statistics.register(parseResult.opponent, parseResult.ship, parseResult.avatar);
    
    avatar.registerAction();
    
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

export default AvatarDecoyDroneFailureType;