"use strict"

import {pattern} from 'regex';
import Expression from './expression.js';
import BeamResourceResult from '../parse-result/beam-resource-result.js';
import BeamResource from '../../enum/beam-resource.js';
import BuildingResult from '../parse-result/building-result.js';
import BuildingType from '../../enum/building-type.js';

/**
 * Parses a building type or name and type from German language logs.  
 * Examples: `Phaserkanone`, `PewPew(Phaserkanone)`
 * Returns the following named groups when matching:  
 * `name`: name of the building if named, empty otherwise  
 * `amount`: amount of that resource that is being transported, uses decimal comma instead of decimal point!
 */
class Building extends Expression {
  static regexPattern = pattern`
    (?:
      (?<name> .{1,20})
      \ *
      \(
    )?
    (?<type> [^\(\)]+)
    \)?
  `;

  /**
   * @returns {?BuildingResult} building data extracted from the text or null if there's no match
   * @inheritdoc 
   */
  static matchResult(text) {
    const match = this.match(text);
    if(match === null) {
      return null;
    }

    const resultObject = new BuildingResult;
    resultObject.name = match.groups.name ?? null;
    switch(String(match.groups.type).toLowerCase().trim()) {
      case "base camp":
      case "basislager":
        resultObject.type = BuildingType.baseCamp;
        break;
      case "farm":
        resultObject.type = BuildingType.farm;
        break;
      case "solar cells":
      case "solarzellen":
        resultObject.type = BuildingType.solarCells;
        break;
      case "nature preserve":
      case "naturpark":
        resultObject.type = BuildingType.naturePreserve;
        break;
      case "storage compound":
      case "lager":
        resultObject.type = BuildingType.storageCompound;
        break;
      case "colony headquarters":
      case "koloniezentrale":
        resultObject.type = BuildingType.colonyHeadquarters;
        break;
      case "solar array":
      case "solarkomplex":
        resultObject.type = BuildingType.solarArray;
        break;
      case "plasteel factory":
      case "baumaterialfabrik":
        resultObject.type = BuildingType.plasteelFactory;
        break;
      case "town":
      case "häuser":
        resultObject.type = BuildingType.town;
        break;
      case "iridium mine":
      case "mine":
        resultObject.type = BuildingType.iridiumMine;
        break;
      case "duranium factory":
      case "duraniumanlage":
        resultObject.type = BuildingType.duraniumFactory;
        break;
      case "dilithium mine":
      case "dilithium-mine":
        resultObject.type = BuildingType.dilithiumMine;
        break;
      case "hydroponic dome":
      case "hydroponic-kuppel":
        resultObject.type = BuildingType.hydroponicDome;
        break;
      case "habitat dome":
      case "habitat-kuppel":
        resultObject.type = BuildingType.habitatDome;
        break;
      case "workbee spaceport":
      case "workbee-raumbahnhof":
        resultObject.type = BuildingType.workBeeSpaceport;
        break;
      case "solar satellite":
      case "solarsatellit":
        resultObject.type = BuildingType.solarSatellite;
        break;
      case "flow turbine":
      case "strömungsturbinen":
        resultObject.type = BuildingType.flowTurbine;
        break;
      case "algae farm":
      case "algenfarm":
        resultObject.type = BuildingType.algaeFarm;
        break;
      case "city":
      case "stadt":
        resultObject.type = BuildingType.city;
        break;
      case "phaser cannon":
      case "phaserkanone":
        resultObject.type = BuildingType.phaserCannon;
        break;
      case "headquarters":
      case "basiskuppel":
        resultObject.type = BuildingType.headquarters;
        break;
      case "hydrolysis facility":
      case "hydrolysefabrik":
        resultObject.type = BuildingType.hydrolysisFacility;
        break;
      case "fusion reactor":
      case "fusionsreaktor":
        resultObject.type = BuildingType.fusionReactor;
        break;
      case "beam blocker":
      case "beamblocker":
        resultObject.type = BuildingType.beamBlocker;
        break;
      case "tunnel system":
      case "tunnelsystem":
        resultObject.type = BuildingType.tunnelSystem;
        break;
      case "radiation collector":
      case "strahlungssammler":
        resultObject.type = BuildingType.radiationCollector;
        break;
      case "orbital shipyard":
      case "große werft":
        resultObject.type = BuildingType.orbitalShipyard;
        break;
      case "weather control station":
      case "wetterkontrollstation":
        resultObject.type = BuildingType.weatherControlStation;
        break;
      case "geothermal power plant":
      case "geothermales kraftwerk":
        resultObject.type = BuildingType.geothermalPowerPlant;
        break;
      case "industrial replicator":
      case "industrieller replikator":
        resultObject.type = BuildingType.industrialReplicator;
        break;
      case "nitrium mine":
      case "nitrium-mine":
        resultObject.type = BuildingType.nitriumMine;
        break;
      case "tritanium factory":
      case "tritaniumanlage":
        resultObject.type = BuildingType.tritaniumFactory;
        break;
      case "particle accelerator":
      case "teilchenbeschleuniger":
        resultObject.type = BuildingType.particleAccelerator;
        break;
      case "warp core":
      case "warpkern":
        resultObject.type = BuildingType.warpCore;
        break;
      case "research center":
      case "forschungszentrum":
        resultObject.type = BuildingType.warpCore;
        break;
      case "subsurface storage facility":
      case "lager-system":
        resultObject.type = BuildingType.subsurfaceStorageFacility;
        break;
      case "scan blocker":
      case "scanblockierer":
        resultObject.type = BuildingType.scanBlocker;
        break;
      case "jupiter station":
      case "jupiterstation":
        resultObject.type = BuildingType.jupiterStation;
        break;
      case "shield tower":
      case "schildturm":
        resultObject.type = BuildingType.shieldTower;
        break;
      case "orbital habitat":
      case "orbitalhabitat":
        resultObject.type = BuildingType.orbitalHabitat;
        break;
      case "phaser battery":
      case "phaserbatterie":
        resultObject.type = BuildingType.phaserBattery;
        break;
      case "torpedo battery":
      case "torpedoplattform":
        resultObject.type = BuildingType.torpedoBattery;
        break;
      case "subspace telescope":
      case "subraumteleskop":
        resultObject.type = BuildingType.subspaceTelescope;
        break;
      case "sensor phalanx":
      case "sensorphalanx":
        resultObject.type = BuildingType.sensorPhalanx;
        break;
      case "polaron power plant":
      case "polaronkraftwerk":
        resultObject.type = BuildingType.polaronPowerPlant;
        break;
      case "dual particle accelerator":
      case "doppelbeschleuniger":
        resultObject.type = BuildingType.dualParticleAccelerator;
        break;
      case "adv. research center":
      case "adv. forschungszentrum":
        resultObject.type = BuildingType.advancedResearchCenter;
        break;
      case "space elevator":
      case "orbitalseil":
        resultObject.type = BuildingType.spaceElevator;
        break;
      case "torpedo factory":
      case "torpedofabrik":
        resultObject.type = BuildingType.torpedoFactory;
        break;
      case "sorium mine":
      case "sorium-förderanlage":
        resultObject.type = BuildingType.soriumMine;
        break;
      case "plasma converter":
      case "plasmakonverter":
        resultObject.type = BuildingType.plasmaConverter;
        break;
      case "disruptor battery":
      case "disruptorbatterie":
        resultObject.type = BuildingType.disruptorBattery;
        break;
      case "phase mutator":
      case "phasenmutator":
        resultObject.type = BuildingType.phaseMutator;
        break;
      case "active phase mutator":
      case "aktiver phasenmutator":
        resultObject.type = BuildingType.activePhaseMutator;
        break;
      case "recreation center":
      case "erholungszentrum":
        resultObject.type = BuildingType.recreationCenter;
        break;
      case "labour camp":
      case "labor camp":
      case "arbeitslager":
        resultObject.type = BuildingType.labourCamp;
        break;
      case "debris field":
      case "trümmerfeld":
        resultObject.type = BuildingType.debrisField;
        break;
      default:
        resultObject.type = BuildingType.unknown;
    }
    return resultObject;
  }
}

export default Building;