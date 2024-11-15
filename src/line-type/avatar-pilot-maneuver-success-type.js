"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/avatar.js";
import AvatarPilotManeuverSuccessResult from "./parse-result/avatar-pilot-maneuver-success-result.js";

class AvatarPilotManeuverSuccessType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ manövriert\ erfolgreich\ in\ einen\ toten\ Winkel\ von\ 
      (?<target> \g<shipAndNcc>)
      ,\ wodurch\ sich\ die\ Chance\ für\ 
      (?<ship> \g<shipAndNcc>)
      \ ergibt(?: ,?)\ kritische\ Schäden\ \(x2\)\ zu\ verursachen!
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
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    
    const resultObject = new AvatarPilotManeuverSuccessResult
    resultObject.target = target;
    resultObject.avatar = avatar;
    resultObject.ship = ship;
    
    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.avatarActionSuccess,
    ];
  }
}

export default AvatarPilotManeuverSuccessType;