"use strict"

import PlayerNameAndId from "../regex/player-name-and-id.js";
import MapCoordinates from "../regex/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import { pattern } from "regex";
import ShipNameOnly from "../regex/ship-name-only.js";
import BeamResourcesType from "./beam-resources-type.js";

class BeamEnergyType extends BeamResourcesType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipNameOnly>)
      \ NCC\ 
      (?<shipNcc>\d+)
      (?:
        \ von \ 
        (?<owner> \g<playerAndId>)
      )?
      \ 
      (?<transportType>beamt|transportiert)
      \ in\ Sektor\ 
      (?<sector> \g<sectorCoordinates>)
      \ 
      (?<amount>\d+(?:,\d+)?)
      \ 
      (?<beamEnergyResource> Energie|Warpkern)
      \ 
      (?<direction>von|zu)
      \ 
      (?<target> \g<shipNameOnly>)
      $
      `,
      {
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
      }
    ),
    //TODO: Add English regex
  }
}

export default BeamEnergyType;