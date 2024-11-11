"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/avatar.js";
import AvatarEnergyRecoveryResult from "./parse-result/avatar-energy-recovery-result.js";

class AvatarEnergyRecoveryType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ optimiert\ den\ Abschuss\ von \ 
      (?<ship> \g<shipAndNcc>)
      \ und\ gewinnt\ dabei\ 
      (?<recovered_main_energy> \d+(?:[,\.]\d+)?)
      \ Hauptenergie\ zurück!
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
    const mainEnergy = Number(matches.groups.recovered_main_energy.replace(",", "."));

    const resultObject = new AvatarEnergyRecoveryResult;
    resultObject.ship = ship;
    resultObject.avatar = avatar;
    resultObject.energy = mainEnergy;

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

export default AvatarEnergyRecoveryType;