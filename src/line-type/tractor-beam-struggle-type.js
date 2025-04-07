"use strict"

import ShipNameOnly from '../regex/ship-name-only.js'

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import TractorBeamStruggleResult from './parse-result/tractor-beam-struggle-result.js';

class TractorBeamStruggleType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<target> \g<shipNameOnly>)
      \ versucht\ sich\ vom\ Traktorstrahl\ von\ 
      (?<ship> \g<shipNameOnly>)
      \ loszureißen!
      $
      `,
      {
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
      }
    ),
    // TODO: Add English regex
  }

  static _buildResultObject(matches) {
    const ship = ShipNameOnly.matchResult(matches.groups.ship);
    const target = ShipNameOnly.matchResult(matches.groups.target);

    const resultObject = new TractorBeamStruggleResult;
    resultObject.ship = ship;
    resultObject.target = target;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.tractorBeam,
    ];
  }
}

export default TractorBeamStruggleType;