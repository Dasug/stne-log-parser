"use strict"

import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import FullSystemFailureResult from "./parse-result/full-system-failure-result.js";

class FullSystemFailureType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ erleidet\ einen\ Ausfall\ aller\ Systeme,\ 
      das\ Schiff\ wird\ Starthilfe\ brauchen\ um\ wieder\ flott\ gemacht\ zu\ werden!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ suffers\ a\ full\ system\ failure\.\ 
      The\ ship\ will\ need\ assistance\ before\ it\ can\ start\ back\ up!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);

    const resultObject = new FullSystemFailureResult;
    resultObject.ship = ship;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.shipDisabled,
      LineTag.redundant,
    ];
  }
}

export default FullSystemFailureType;