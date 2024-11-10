"use strict"

import PlayerNameAndId from "../regex/player-name-and-id.js";
import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import MainComputerCrashResult from "./parse-result/main-computer-crash-result.js";

class MainComputerCrashType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ von \ 
      (?<owner> \g<playerAndId>)
      \ ist\ der\ Hauptcomputer\ abgestürzt!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (
        \ (?:by|from) \ 
        (?<owner> \g<playerAndId>)
      )?
      \ experiences\ a\ system\ crash,\ 
      causing\ the\ main\ computer\ to\ go\ down!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const owner = typeof matches.groups.owner === "undefined" ? null : PlayerNameAndId.matchResult(matches.groups.owner);

    const resultObject = new MainComputerCrashResult;
    resultObject.ship = ship;
    resultObject.owner = owner;


    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.shipDisabled,
    ];
  }
}

export default MainComputerCrashType;