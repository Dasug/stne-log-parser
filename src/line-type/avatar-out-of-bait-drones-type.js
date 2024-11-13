"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/avatar.js";
import AvatarOutOfBaitDronesResult from "./parse-result/avatar-out-of-bait-drones-result.js";

class AvatarOutOfBaitDronesType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ hat\ keine\ Köderdrohnen\ mehr\ zur\ Verfügung\ und\ kann\ deshalb\ nichts\ für\ 
      (?<target> \g<shipAndNcc>)
      \ tun\ um\ dem\ Angriff\ von\ 
      (?<ship> \g<shipAndNcc>)
      \ zu\ engehen!
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
    const target = ShipNameAndNcc.matchResult(matches.groups.target);

    const resultObject = new AvatarOutOfBaitDronesResult;
    resultObject.ship = ship;
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

export default AvatarOutOfBaitDronesType;