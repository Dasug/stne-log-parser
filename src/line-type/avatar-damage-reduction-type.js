"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/avatar.js";
import AvatarDamageReductionResult from "./parse-result/avatar-damage-reduction-result.js";

class AvatarDamageReductionType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ stört\ die\ Zielerfassung\ von\ 
      (?<ship> \g<shipAndNcc>)
      ,\ wodurch\ dessen\ Angriff\ auf\ 
      (?<target> \g<shipAndNcc>)
      \ um \ 
      (?<damage_reduction> \d+?)%
      \ schwächer\ ausfällt!
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
    const damageReduction = Number(matches.groups.damage_reduction);

    const resultObject = new AvatarDamageReductionResult;
    resultObject.ship = ship;
    resultObject.target = target;
    resultObject.avatar = avatar;
    resultObject.damageReduction = damageReduction;

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

export default AvatarDamageReductionType;