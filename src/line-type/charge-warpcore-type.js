"use strict"

import PlayerNameAndId from "../regex/player-name-and-id.js";
import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import ChargeWarpcoreResult from "./parse-result/charge-warpcore-result.js";
import LineTag from "./tags/line-tag.js";

class ChargeWarpcoreType extends GenericType {
  static #regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (
        \ von\ 
        (?<owner> \g<playerAndId>)
      )?
      \ hat\ den\ Warpkern\ um\ 
      (?<charge_amount> \d+(?:,|.\d+))
      \ auf \ 
      (?<warpcore_state> \d+(?:,|.\d+))
      \ aufgeladen$
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
      \ has\ charged\ its\ warp\ core\ by\ 
      (?<charge_amount> \d+(?:,|.\d+)?)
      \ up\ to \ 
      (?<warpcore_state> \d+(?:,|.\d+)?)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    )
  }

  static detect(text, language) {
    if (typeof this.#regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return false;
    }
    return text.match(this.#regexByLanguage[language]) !== null;
  }

  static parse(text, language) {
    if (typeof this.#regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return null;
    }
    const matches = text.match(this.#regexByLanguage[language]);

    if(matches === null) {
      return null;
    }

    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const owner = matches.groups.owner === undefined ? null : PlayerNameAndId.matchResult(matches.groups.owner);
    const chargeAmount = parseFloat(matches.groups.charge_amount.replace(",", "."));
    const warpcoreState = parseFloat(matches.groups.warpcore_state.replace(",", "."));

    const resultObject = new ChargeWarpcoreResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.chargeAmount = chargeAmount;
    resultObject.warpcoreState = warpcoreState;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.shipMaintenance,
    ];
  }
}

export default ChargeWarpcoreType;