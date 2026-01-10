"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import MapCoordinates from "../regex/subroutine/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import DestroyShipResult from "./parse-result/destroy-ship-result.js";
import Statistics from "../statistics/statistics.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";

class DestroyShipType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Kontakt\ zu\ 
      (?<ship> \g<shipAndNcc>)
      (
        \ von\ 
        (?<owner> \g<playerAndId>)
      )?
      \ verloren!\ Letzte\ bekannte\ Position:\ 
      (?<sector> \g<sectorCoordinates>)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>)
      (
        \ (?:from|by)\ 
        (?<owner> \g<playerAndId>)
      )?
      \ was\ destroyed\ at\ 
      (?<sector> \g<sectorCoordinates>)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    )
  }

  static _linebreakFixRegex = addSubroutines(
    pattern`
      (?<= (von|from|by)\ *)
      \n
      (?= \ *(?<owner> \g<playerAndId>))
    `,
    {
      "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
    },
    'g'
  );

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const owner = PlayerNameAndId.matchResult(matches.groups.owner) ?? null;
    const position = MapCoordinates.matchResult(matches.groups.sector);

    const resultObject = new DestroyShipResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.sector = position;


    return resultObject;
  }

  /** fixes the lines in this log entry being split in some cases when copying it from the STNE log page */
  static fixSplitLines(logText) {
    const regexp = this._linebreakFixRegex;
    return logText.replaceAll(regexp, ' ');
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    const {ship: ship} = statistics.registerShipAndOwner(parseResult.ship, parseResult.owner);
    ship.destroyShip();
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.shipDestruction,
    ];
  }
}

export default DestroyShipType;
