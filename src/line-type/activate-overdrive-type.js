"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import ActivateOverdriveResult from "./parse-result/activate-overdrive-result.js";
import LineTag from "../../src/enum/line-tag.js";

class ActivateOverdriveType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (
        \ von\ 
        (?<owner> \g<playerAndId>)
      )?
      \ +aktiviert\ den\ Overdrive\ und\ kann\ nun,\ trotz\ überhitzter\ Triebwerke,\ weiterfliegen!
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
        \ (?:von|by|from)\ # this part is in German even in the English log
        (?<owner> \g<playerAndId>)
      )?
      \ activates\ its\ overdrive\ and\ can\ now,\ in\ spite\ of\ its\ overheated\ engines,\ continue\ flight!
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
    const owner = matches.groups.owner === undefined ? null : PlayerNameAndId.matchResult(matches.groups.owner);

    const resultObject = new ActivateOverdriveResult;
    resultObject.ship = ship;
    resultObject.owner = owner;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.shipMaintenance,
    ];
  }
}

export default ActivateOverdriveType;