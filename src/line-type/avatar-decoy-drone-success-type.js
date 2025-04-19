"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarDecoyDroneSuccessResult from "./parse-result/avatar-decoy-drone-success-result.js";
import ColonyNameAndId from "../regex/subroutine/colony-name-and-id.js";

class AvatarDecoyDroneSuccessType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<opponent> \g<shipAndNcc>|\g<colonyNameAndId>)
      \ trifft\ die\ Köderdrohne\ von\ 
      (?<trigger_avatar> \g<avatar>)
      \ auf\  
      (?<ship> \g<shipAndNcc>)
      \ mit\ 
      (?<weapon_name> .+)
      \ und\ zerstört\ sie!
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
    const opponentShip = ShipNameAndNcc.matchResult(matches.groups.opponent);
    const opponentColony = ColonyNameAndId.matchResult(matches.groups.opponent);
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const weaponName = matches.groups.weapon_name;
    
    const resultObject = new AvatarDecoyDroneSuccessResult;
    resultObject.avatar = avatar;
    resultObject.opponent = opponentShip ?? opponentColony;
    resultObject.ship = ship;
    resultObject.weaponName = weaponName;
    
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

export default AvatarDecoyDroneSuccessType;