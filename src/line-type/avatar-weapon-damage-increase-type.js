"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/avatar.js";
import AvatarWeaponDamageIncreaseResult from "./parse-result/avatar-weapon-damage-increase-result.js";

class AvatarWeaponDamageIncreaseType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ zielt\ auf\ ein\ kritisches\ Untersystem\ wodurch\ der\ Angriff\ von \ 
      (?<ship> \g<shipAndNcc>)
      \ gegen\ 
      (?<target> \g<shipAndNcc>)
      \ um \ 
      (?<damage_increase> \d+?)%
      \ stärker\ ausfällt!
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
    const damageIncrease = Number(matches.groups.damage_increase);

    const resultObject = new AvatarWeaponDamageIncreaseResult;
    resultObject.ship = ship;
    resultObject.target = target;
    resultObject.avatar = avatar;
    resultObject.damageIncrease = damageIncrease;

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

export default AvatarWeaponDamageIncreaseType;