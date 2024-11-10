"use strict"

import MapCoordinates from "../regex/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import DefenseSlotsResult from "./parse-result/defense-slots-result.js";

class DefenseSlotsType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<defense_slots_amount> \d+(?:[,\.]\d+)?)
      \ +Verteidigungskosten\ +
      (?<sector> \g<sectorCoordinates>)
      $
      `,
      {
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?<defense_slots_amount> \d+(?:[,\.]\d+)?)
      \ +Slots\ Defence\ Cost\ +
      (?<sector> \g<sectorCoordinates>)
      $
      `,
      {
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const sector = MapCoordinates.matchResult(matches.groups.sector);
    const slots = Number(matches.groups.defense_slots_amount.replace(",", "."));

    const resultObject = new DefenseSlotsResult;
    resultObject.sector = sector;
    resultObject.slots = slots;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.battleSlots,
    ];
  }
}

export default DefenseSlotsType;