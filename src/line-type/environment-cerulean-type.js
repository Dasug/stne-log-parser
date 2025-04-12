"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import MapCoordinates from "../regex/subroutine/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import ShipNameOnly from "../regex/subroutine/ship-name-only.js";
import ColonyNameAndId from "../regex/subroutine/colony-name-and-id.js";
import EnterOrbitResult from "./parse-result/enter-orbit-result.js";
import OrbitEntryDirection from "../enum/orbit-entry-direction.js";
import EnvironmentCeruleanResult from "./parse-result/environment-cerulean-result.js";

class EnvironmentCeruleanType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      \ verliert\ 
      (?<energyLoss> \d+(?:,\d+)?)
      \ Energie\ durch\ die\ Einwirkung\ eines\ 
      Cerule?anischen # e is missing in the original log message, added it here in case they ever fix the typo
      \ Nebels!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
      }
    ),
    // TODO: add English pattern
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const energyLoss = Number(matches.groups.energyLoss.replaceAll(",", "."));

    const resultObject = new EnvironmentCeruleanResult;
    resultObject.ship = ship;
    resultObject.energyLoss = energyLoss;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.shipMovement,
      LineTag.environmentEffect,
    ];
  }
}

export default EnvironmentCeruleanType;