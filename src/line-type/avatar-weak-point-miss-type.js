"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/avatar.js";
import AvatarWeakPointMissResult from "./parse-result/avatar-weak-point-miss-result.js";

class AvatarWeakPointMissType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ verfehlt\ die\ anvisierte\ Schwachstelle\ von \ 
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
    
    const resultObject = new AvatarWeakPointMissResult;
    resultObject.target = target;
    resultObject.avatar = avatar;
    
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

export default AvatarWeakPointMissType;