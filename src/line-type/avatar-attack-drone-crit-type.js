"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/avatar.js";
import AvatarAttackDroneCritResult from "./parse-result/avatar-attack-drone-crit-result.js";

class AvatarAttackDroneCritType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Die\ Drohne\ trifft\ und\ 
      (?:
        setzt\ am\ Einschlagort\ die\ Notfallkraftfelder\ 
        |
        destabilisiert\ das\ Schildgitter\ 
      )
      von\ 
      (?<target> \g<shipAndNcc>)
      \ durch\ einen\ EMP-Impuls
      (?:\ außer\ Gefecht)?
      ,\ wodurch\ sich\ die\ Chance\ für\ 
      (?<trigger_avatar> \g<avatar>)
      \ ergibt\ kritische\ Schäden\ \(x2\)\ gegen\ 
      (?<target_again> \g<shipAndNcc>)
      \ zu\ verursachen!
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
    
    const resultObject = new AvatarAttackDroneCritResult;
    resultObject.target = target;
    resultObject.avatar = avatar;
    
    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.avatarActionSuccess,
    ];
  }
}

export default AvatarAttackDroneCritType;