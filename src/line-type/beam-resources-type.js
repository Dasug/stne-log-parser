"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import MapCoordinates from "../regex/subroutine/map-coordinates.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../enum/line-tag.js";
import ShipNameOnly from "../regex/subroutine/ship-name-only.js";
import BeamResourceDe from "../regex/subroutine/beam-resource-de.js";
import BeamTransportType from "../enum/beam-transport-type.js";
import BeamDirection from "../enum/beam-direction.js";
import BeamResult from "./parse-result/beam-result.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import BeamResourceResult from "../regex/parse-result/beam-resource-result.js";
import BeamResource from "../enum/beam-resource.js";
import Statistics from "../statistics/statistics.js";
import ShipNameOnlyResult from "../regex/parse-result/ship-name-only-result.js";

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
      (?<beamResourcesString> 
        # for some reason beamResources has to be a capturing group here even if it's unused
        # or it won't match on Node 20. It works on all other node versions I tested though
        (?<beamResources> (\ \g<beamResourceDe>))+
      )
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
    const shipNcc = ship instanceof ShipNameAndNccResult ? ship.ncc : (typeof matches.groups.shipNcc === "undefined" ? null : Number(matches.groups.shipNcc));
    const targetWithNccMatch = ShipNameAndNcc.matchResult(matches.groups.target);
    const beamTarget = targetWithNccMatch !== null ? targetWithNccMatch : ShipNameOnly.matchResult(matches.groups.target);
    const owner = typeof matches.groups.owner === "undefined" ? null : PlayerNameAndId.matchResult(matches.groups.owner);
    const transportType = ['transportiert'].includes(matches.groups.transportType) ? BeamTransportType.transport : BeamTransportType.beam;
    const sector = MapCoordinates.matchResult(matches.groups.sector);
    const beamDirection = ['von'].includes(matches.groups.direction) ? BeamDirection.fromTarget : BeamDirection.toTarget;
    let beamResources = [];
    if(typeof matches.groups.beamResourcesString !== "undefined") {
      const beamResourcesString = matches.groups.beamResourcesString ?? "";
      beamResources = beamResourcesString.split(". ").map(
        resourceString => BeamResourceDe.matchResult(resourceString.endsWith(".") ? resourceString : (resourceString.trim() + "."))
      );
    } else if(typeof matches.groups.beamEnergyResource !== "undefined") {
      const beamEnergyResource = new BeamResourceResult;
      switch(matches.groups.beamEnergyResource) {
        case "Energie":
          beamEnergyResource.resource = BeamResource.energy;
          break;
        case "Warpkern":
          beamEnergyResource.resource = BeamResource.warpCore;
          break;
        default:
          beamEnergyResource.resource = BeamResource.unknown;
      }
      beamEnergyResource.amount = Number((matches.groups.amount ?? "").replaceAll(",", "."));
      beamResources = [...beamResources, beamEnergyResource];
    }

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

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    const {ship: registeredShip} = statistics.registerShipAndOwner(parseResult.ship, parseResult.owner);
    if(registeredShip.ncc === null && parseResult.ncc !== null) {
      statistics.ships.updateShipNcc(registeredShip, parseResult.ncc);
    }
    
    statistics.register(parseResult.beamTarget);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.transport,
    ];
  }
}

export default BeamResourcesType;