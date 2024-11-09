"use strict"

import PlayerNameAndId from "../regex/player-name-and-id.js";
import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import ActivateShieldsResult from "./parse-result/activate-shields-result.js";
import LineTag from "./tags/line-tag.js";

class ActivateShieldsType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (
        \ von\ 
        (?<owner> \g<playerAndId>)
      )?
      \ aktiviert\ die\ Schilde
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
        \ von\ # this part is in German even in the English log
        (?<owner> \g<playerAndId>)
      )?
      \ raises\ shields
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    )
  }

  static parse(text, language) {
    if (typeof this._regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return null;
    }
    const matches = text.match(this._regexByLanguage[language]);

    if(matches === null) {
      return null;
    }

    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const owner = matches.groups.owner === undefined ? null : PlayerNameAndId.matchResult(matches.groups.owner);

    const resultObject = new ActivateShieldsResult;
    resultObject.ship = ship;
    resultObject.owner = owner;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
    ];
  }
}

export default ActivateShieldsType;