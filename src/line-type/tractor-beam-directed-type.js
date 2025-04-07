"use strict"

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import ShipNameAndNcc from '../regex/ship-name-and-ncc.js';
import PlayerNameAndId from '../regex/player-name-and-id.js';
import TractorBeamDirectedResult from './parse-result/tractor-beam-directed-result.js';

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

  static getTags() {
    return [
      LineTag.tractorBeam,
    ];
  }
}

export default TractorBeamDirectedType;