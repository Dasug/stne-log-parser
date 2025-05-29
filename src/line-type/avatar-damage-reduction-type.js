"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import ColonyNameAndId from "../regex/subroutine/colony-name-and-id.js";
import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarDamageReductionResult from "./parse-result/avatar-damage-reduction-result.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";

class AvatarDamageReductionType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ stört\ die\ Zielerfassung\ von\ 
      (?:
        (?<ship> \g<shipAndNcc>)
        |
        (?<colony> \g<colonyNameAndId>)
      )
      ,\ wodurch\ dessen\ Angriff\ auf\ 
      (?<target> \g<shipAndNcc>)
      \ um \ 
      (?<damage_reduction> \d+?)%
      \ schwächer\ ausfällt!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "colonyNameAndId": ColonyNameAndId.asSubroutineDefinition(),
        "avatar": Avatar.asSubroutineDefinition(),
      }
    ),
    // TODO: add regex for English log
  }

  static _buildResultObject(matches) {
    const avatar = Avatar.matchResult(matches.groups.trigger_avatar);
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const colony = ColonyNameAndId.matchResult(matches.groups.colony);
    const target = ShipNameAndNcc.matchResult(matches.groups.target);
    const damageReduction = Number(matches.groups.damage_reduction);

    const resultObject = new AvatarDamageReductionResult;
    resultObject.origin = ship ?? colony;
    resultObject.target = target;
    resultObject.avatar = avatar;
    resultObject.damageReduction = damageReduction;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ship
    if(parseResult.origin instanceof ShipNameAndNccResult) {
      statistics.ships.registerShip(parseResult.origin);
    }
    if(parseResult.target instanceof ShipNameAndNccResult) {
      statistics.ships.registerShip(parseResult.target);
    }
    
    return statistics;
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