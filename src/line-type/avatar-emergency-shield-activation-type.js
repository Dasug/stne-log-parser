"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/avatar.js";
import AvatarEmergencyShieldActivationResult from "./parse-result/avatar-emergency-shield-activation-result.js";

class AvatarEmergencyShieldActivationType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ an\ Bord\ von\ 
      (?<ship> \g<shipAndNcc>)
      \ reagiert\ blitzschnell\ und\ schafft\ es\ in\ buchstäblich\ letzter\ Sekunde(?:,?)\ den\ Schildauslöser\ zu\ erreichen!
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
    
    const resultObject = new AvatarEmergencyShieldActivationResult;
    resultObject.avatar = avatar;
    resultObject.ship = ship;
    
    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.avatarAction,
      LineTag.avatarActionSuccess,
    ];
  }
}

export default AvatarEmergencyShieldActivationType;