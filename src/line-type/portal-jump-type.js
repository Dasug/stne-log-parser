"use strict"

import MapCoordinates from "../regex/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import PortalJumpResult from "./parse-result/portal-jump-result.js";
import LineTag from "../../src/enum/line-tag.js";

class PortalJumpType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Sprung\ von\ +
      (?<sector_from> \g<sectorCoordinates>)
      \ +nach\ +
      (?<sector_to> \g<sectorCoordinates>)
      \ +ausgeführt!
      $
      `,
      {
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      Jump\ from\ +
      (?<sector_from> \g<sectorCoordinates>)
      \ +to\ +
      (?<sector_to> \g<sectorCoordinates>)
      \ +executed!
      $
      `,
      {
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const sectorFrom = MapCoordinates.matchResult(matches.groups.sector_from);
    const sectorTo = MapCoordinates.matchResult(matches.groups.sector_to);

    const resultObject = new PortalJumpResult;
    resultObject.sectorFrom = sectorFrom;
    resultObject.sectorTo = sectorTo;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.shipMovement,
    ];
  }
}

export default PortalJumpType;