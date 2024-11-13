"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/avatar.js";
import AvatarDecoyDroneFailureResult from "./parse-result/avatar-decoy-drone-failure-result.js";

class AvatarDecoyDroneFailureType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ setzt\ eine\ Köderdrohne\ ein,\ kann\ die\ Zielerfassung\ von\ 
      (?<opponent> \g<shipAndNcc>)
      \ beim\ Angriff\ auf\  
      (?<ship> \g<shipAndNcc>)
      \ aber\ nicht\ täuschen!
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
    const opponent = ShipNameAndNcc.matchResult(matches.groups.opponent);
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    
    const resultObject = new AvatarDecoyDroneFailureResult;
    resultObject.avatar = avatar;
    resultObject.opponent = opponent;
    resultObject.ship = ship;
    
    return resultObject;
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