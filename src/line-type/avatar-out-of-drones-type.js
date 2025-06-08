"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import AvatarOutOfDronesResult from "./parse-result/avatar-out-of-drones-result.js";
import DronePilotDroneType from "../enum/drone-pilot-drone-type.js";
import ColonyNameAndId from "../regex/subroutine/colony-name-and-id.js";
import Statistics from "../statistics/statistics.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";

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
      (?<opponent> \g<shipAndNcc>|\g<colonyNameAndId>)
      \ zu\ 
      (?: en(?:t?)gehen|verstärken)
      !
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
    const opponentShip = ShipNameAndNcc.matchResult(matches.groups.opponent);
    const opponentColony = ColonyNameAndId.matchResult(matches.groups.opponent);
    const droneType = matches.groups.drone_type;

    const resultObject = new AvatarOutOfDronesResult;
    resultObject.ship = ship;
    resultObject.opponent = opponentShip ?? opponentColony;
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

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    const [,, avatar] = statistics.register(parseResult.ship, parseResult.opponent, parseResult.avatar);
    
    avatar.registerAction();
    
    return statistics;
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