"use strict"

import PlayerNameAndId from "../regex/player-name-and-id.js";
import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";
import ShipNameOnly from '../regex/ship-name-only.js'

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import TractorBeamDragAlongResult from "./parse-result/tractor-beam-drag-along-result.js";
import LineTag from "../../src/enum/line-tag.js";

class TractorBeamDragAlongType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>|\g<shipNameOnly>)
      (
        \ von\ 
        (?<owner> \g<playerAndId>)
      )?
      \ +wird\ im\ Traktorstrahl\ hinterhergezogen\.
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>|\g<shipNameOnly>)
      (
        \ von\ # this part is in German even in the English log
        (?<owner> \g<playerAndId>)
      )?
      \ +is\ pulled\ by\ a\ tractor\ beam\.
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const shipNameAndNccMatch = ShipNameAndNcc.matchResult(matches.groups.ship);
    const ship = shipNameAndNccMatch === null ? ShipNameOnly.matchResult(matches.groups.ship) : shipNameAndNccMatch;
    const owner = typeof matches.groups.owner === "undefined" ? null : PlayerNameAndId.matchResult(matches.groups.owner);

    const resultObject = new TractorBeamDragAlongResult;
    resultObject.ship = ship;
    resultObject.owner = owner;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.shipMovement,
      LineTag.tractorBeam,
    ];
  }
}

export default TractorBeamDragAlongType;