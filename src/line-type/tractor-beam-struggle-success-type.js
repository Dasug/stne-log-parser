"use strict"

import ShipNameOnly from '../regex/subroutine/ship-name-only.js'

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import TractorBeamStruggleSuccessResult from './parse-result/tractor-beam-struggle-success-results.js';
import Statistics from '../statistics/statistics.js';

class TractorBeamStruggleSuccessType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<target> \g<shipNameOnly>)
      \ konnte\ sich\ vom\ Traktorstrahl\ losreißen\.
      $
      `,
      {
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
      }
    ),
    // TODO: Add English regex
  }

  static _buildResultObject(matches) {
    const target = ShipNameOnly.matchResult(matches.groups.target);

    const resultObject = new TractorBeamStruggleSuccessResult;
    resultObject.target = target;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.register(parseResult.target);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.tractorBeam,
    ];
  }
}

export default TractorBeamStruggleSuccessType;