"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarOutOfDronesResult from "./parse-result/avatar-out-of-drones-result.js";
import DronePilotDroneType from "../enum/drone-pilot-drone-type.js";

class AvatarOutOfDronesType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ hat\ keine\ 
      (?<drone_type> Köder|Angriffs)drohnen
      \ mehr\ zur\ Verfügung\ und\ kann\ deshalb\ nichts\ für\ 
      (?<ship> \g<shipAndNcc>)
      \ tun\ um\ 
      (?:
        dem\ Angriff\ von\ 
        |
        den\ Angriff\ gegen\ 
      ) 
      (?<opponent> \g<shipAndNcc>)
      \ zu\ 
      (?: en(?:t?)gehen|verstärken)
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
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const opponent = ShipNameAndNcc.matchResult(matches.groups.opponent);
    const droneType = matches.groups.drone_type;

    const resultObject = new AvatarOutOfDronesResult;
    resultObject.ship = ship;
    resultObject.opponent = opponent;
    resultObject.avatar = avatar;

    switch(droneType.toLowerCase()) {
      case 'köder':
        resultObject.droneType = DronePilotDroneType.decoyDrone;
        break;
      case 'angriffs':
        resultObject.droneType = DronePilotDroneType.attackDrone;
        break;
    }

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

export default AvatarOutOfDronesType;