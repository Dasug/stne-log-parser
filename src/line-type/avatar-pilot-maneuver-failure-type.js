"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarPilotManeuverFailureResult from "./parse-result/avatar-pilot-maneuver-failure-result.js";

class AvatarPilotManeuverFailureType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<target> \g<shipAndNcc>)
      \ kontert\ das\ Manöver\ von\ 
      (?<trigger_avatar> \g<avatar>)
      \ geschickt\ und\ schützt\ erfolgreich\ die\ verwundbaren\ Stellen!
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
    
    const resultObject = new AvatarPilotManeuverFailureResult
    resultObject.target = target;
    resultObject.avatar = avatar;
    
    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.avatarActionFailure,
    ];
  }
}

export default AvatarPilotManeuverFailureType;