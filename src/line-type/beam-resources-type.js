"use strict"

import PlayerNameAndId from "../regex/player-name-and-id.js";
import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";
import MapCoordinates from "../regex/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import SectorEntryResult from "./parse-result/sector-entry-result.js";
import LineTag from "../enum/line-tag.js";
import ShipNameOnly from "../regex/ship-name-only.js";
import BeamResourceDe from "../regex/beam-resource-de.js";
import BeamTransportType from "../enum/beam-transport-type.js";
import BeamDirection from "../enum/beam-direction.js";
import BeamResult from "./parse-result/beam-result.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";

class BeamResourcesType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>|\g<shipNameOnly>)
      (?:
        \ von \ 
        (?<owner> \g<playerAndId>)
      )?
      \ 
      (?<transportType>beamt|transportiert)
      \ in\ Sektor\ 
      (?<sector> \g<sectorCoordinates>)
      \ Waren\ 
      (?<direction>von|zu)
      \ 
      (?<target> \g<shipAndNcc>|\g<shipNameOnly>)
      :
      (?<beamResources> (?:\ \g<beamResourceDe>)+)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "sectorCoordinates": MapCoordinates.asSubroutineDefinition(),
        "beamResourceDe": BeamResourceDe.asSubroutineDefinition(),
      }
    ),
    //TODO: Add English regex
  }

  static _buildResultObject(matches) {
    const shipWithNccMatch = ShipNameAndNcc.matchResult(matches.groups.ship);
    const ship = shipWithNccMatch !== null ? shipWithNccMatch : ShipNameOnly.matchResult(matches.groups.ship);
    const shipNcc = ship instanceof ShipNameAndNccResult ? ship.ncc : null;
    const targetWithNccMatch = ShipNameAndNcc.matchResult(matches.groups.target);
    const beamTarget = targetWithNccMatch !== null ? targetWithNccMatch : ShipNameOnly.matchResult(matches.groups.target);
    const owner = typeof matches.groups.owner === "undefined" ? null : PlayerNameAndId.matchResult(matches.groups.owner);
    const transportType = ['transportiert'].includes(matches.groups.transportType) ? BeamTransportType.transport : BeamTransportType.beam;
    const sector = MapCoordinates.matchResult(matches.groups.sector);
    const beamDirection = ['von'].includes(matches.groups.direction) ? BeamDirection.fromTarget : BeamDirection.toTarget;
    const beamResourcesString = matches.groups.beamResources ?? "";
    const beamResources = beamResourcesString.split(". ").map(
      resourceString => BeamResourceDe.matchResult(resourceString.endsWith(".") ? resourceString : (resourceString.trim() + "."))
    );

    const resultObject = new BeamResult;
    resultObject.ship = ship;
    resultObject.ncc = shipNcc;
    resultObject.beamTarget = beamTarget;
    resultObject.owner = owner;
    resultObject.sector = sector;
    resultObject.transportType = transportType;
    resultObject.beamDirection = beamDirection;
    resultObject.resources = beamResources;
    resultObject.items = [];

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.transport,
    ];
  }
}

export default BeamResourcesType;