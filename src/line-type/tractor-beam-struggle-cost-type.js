"use strict"

import ShipNameOnly from '../regex/subroutine/ship-name-only.js'

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import TractorBeamStruggleCostResult from './parse-result/tractor-beam-struggle-cost-results.js';

class TractorBeamStruggleCostType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Beim\ Versuch\ sich\ vom\ Traktorstrahl\ von\ 
      (?<ship> \g<shipNameOnly>)
      \ loszureißen\ verbraucht\ 
      (?<target> \g<shipNameOnly>)
      \ 
      (?<energyCost>\d+(?:,\d+)?)
      \ Energie\ und\ 
      (?<flightRangeCost>\d+(?:,\d+)?)
      \ Gondeln!
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
    const energyCost = Number(matches.groups.energyCost.replaceAll(",", "."));
    const flightRangeCost = Number(matches.groups.flightRangeCost.replaceAll(",", "."));

    const resultObject = new TractorBeamStruggleCostResult;
    resultObject.ship = ship;
    resultObject.target = target;
    resultObject.energyCost = energyCost;
    resultObject.flightRangeCost = flightRangeCost;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.tractorBeam,
    ];
  }
}

export default TractorBeamStruggleCostType;