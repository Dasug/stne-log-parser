"use strict"

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import ShipNameAndNcc from '../regex/subroutine/ship-name-and-ncc.js';
import PlayerNameAndId from '../regex/subroutine/player-name-and-id.js';
import TractorBeamDirectedResult from './parse-result/tractor-beam-directed-result.js';
import Statistics from "../statistics/statistics.js";

class TractorBeamDirectedType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Traktorstrahl\ auf\ 
      (?<target> \g<shipNameAndNcc>)
      \ von\ 
      (?<targetOwner> \g<playerNameAndId>)
      \ gerichtet
      $
      `,
      {
        "shipNameAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerNameAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    ),
    // TODO: Add English regex
  }

  static _buildResultObject(matches) {
    const target = ShipNameAndNcc.matchResult(matches.groups.target);
    const targetOwner = PlayerNameAndId.matchResult(matches.groups.targetOwner);

    const resultObject = new TractorBeamDirectedResult;
    resultObject.target = target;
    resultObject.targetOwner = targetOwner;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.registerShipAndOwner(parseResult.target, parseResult.targetOwner);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.tractorBeam,
    ];
  }
}

export default TractorBeamDirectedType;