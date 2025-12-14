import { describe, expect, test } from '@jest/globals';
import BuildingType from '../../../src/enum/building-type.js';
import Building from '../../../src/regex/subroutine/building.js';

const buildingDatabase = [
  {type: BuildingType.unknown, nameEn: 'DoesntExist', nameDe: 'ExistiertNicht'},
  {type: BuildingType.baseCamp, nameEn: 'Base Camp', nameDe: 'Basislager'},
  {type: BuildingType.farm, nameEn: 'Farm', nameDe: 'Farm'},
  {type: BuildingType.solarCells, nameEn: 'Solar Cells', nameDe: 'Solarzellen'},
  {type: BuildingType.naturePreserve, nameEn: 'Nature Preserve', nameDe: 'Naturpark'},
  {type: BuildingType.storageCompound, nameEn: 'Storage Compound', nameDe: 'Lager'},
  {type: BuildingType.colonyHeadquarters, nameEn: 'Colony Headquarters', nameDe: 'Koloniezentrale'},
  {type: BuildingType.solarArray, nameEn: 'Solar Array', nameDe: 'Solarkomplex'},
  {type: BuildingType.plasteelFactory, nameEn: 'Plasteel Factory', nameDe: 'Baumaterialfabrik'},
  {type: BuildingType.town, nameEn: 'Town', nameDe: 'Häuser'},
  {type: BuildingType.iridiumMine, nameEn: 'Mine', nameDe: 'Iridium Mine'},
  {type: BuildingType.duraniumFactory, nameEn: 'Duranium Factory', nameDe: 'Duraniumanlage'},
  {type: BuildingType.dilithiumMine, nameEn: 'Dilithium Mine', nameDe: 'Dilithium-Mine'},
  {type: BuildingType.hydroponicDome, nameEn: 'Hydroponic Dome', nameDe: 'Hydroponic-Kuppel'},
  {type: BuildingType.habitatDome, nameEn: 'Habitat Dome', nameDe: 'Habitat-Kuppel'},
  {type: BuildingType.workBeeSpaceport, nameEn: 'WorkBee Spaceport', nameDe: 'WorkBee-Raumbahnhof'},
  {type: BuildingType.solarSatellite, nameEn: 'Solar Satellite', nameDe: 'Solarsatellit'},
  {type: BuildingType.flowTurbine, nameEn: 'Flow Turbine', nameDe: 'Strömungsturbinen'},
  {type: BuildingType.algaeFarm, nameEn: 'Algae Farm', nameDe: 'Algenfarm'},
  {type: BuildingType.city, nameEn: 'City', nameDe: 'Stadt'},
  {type: BuildingType.phaserCannon, nameEn: 'Phaser Cannon', nameDe: 'Phaserkanone'},
  {type: BuildingType.headquarters, nameEn: 'Headquarters', nameDe: 'Basiskuppel'},
  {type: BuildingType.hydrolysisFacility, nameEn: 'Hydrolysis Facility', nameDe: 'Hydrolysefabrik'},
  {type: BuildingType.fusionReactor, nameEn: 'Fusion Reactor', nameDe: 'Fusionsreaktor'},
  {type: BuildingType.beamBlocker, nameEn: 'Beam Blocker', nameDe: 'Beamblocker'},
  {type: BuildingType.tunnelSystem, nameEn: 'Tunnel System', nameDe: 'Tunnelsystem'},
  {type: BuildingType.radiationCollector, nameEn: 'Radiation Collector', nameDe: 'Strahlungssammler'},
  {type: BuildingType.orbitalShipyard, nameEn: 'Orbital Shipyard', nameDe: 'Große Werft'},
  {type: BuildingType.weatherControlStation, nameEn: 'Weather Control Station', nameDe: 'Wetterkontrollstation'},
  {type: BuildingType.geothermalPowerPlant, nameEn: 'Geothermal Power Plant', nameDe: 'Geothermales Kraftwerk'},
  {type: BuildingType.industrialReplicator, nameEn: 'Industrial Replicator', nameDe: 'Industrieller Replikator'},
  {type: BuildingType.nitriumMine, nameEn: 'Nitrium Mine', nameDe: 'Nitrium-Mine'},
  {type: BuildingType.tritaniumFactory, nameEn: 'Tritanium Factory', nameDe: 'Tritaniumanlage'},
  {type: BuildingType.particleAccelerator, nameEn: 'Particle Accelerator', nameDe: 'Teilchenbeschleuniger'},
  {type: BuildingType.warpCore, nameEn: 'Warp Core', nameDe: 'Warpkern'},
  {type: BuildingType.subsurfaceStorageFacility, nameEn: 'Subsurface Storage Facility', nameDe: 'Lager-System'},
  {type: BuildingType.scanBlocker, nameEn: 'Scan Blocker', nameDe: 'Scanblockierer'},
  {type: BuildingType.jupiterStation, nameEn: 'Jupiter Station', nameDe: 'Jupiterstation'},
  {type: BuildingType.shieldTower, nameEn: 'Shield Tower', nameDe: 'Schildturm'},
  {type: BuildingType.orbitalHabitat, nameEn: 'Orbital Habitat', nameDe: 'Orbitalhabitat'},
  {type: BuildingType.phaserBattery, nameEn: 'Phaser Battery', nameDe: 'Phaserbatterie'},
  {type: BuildingType.torpedoBattery, nameEn: 'Torpedo Battery', nameDe: 'Torpedoplattform'},
  {type: BuildingType.subspaceTelescope, nameEn: 'Subspace Telescope', nameDe: 'Subraumteleskop'},
  {type: BuildingType.sensorPhalanx, nameEn: 'Sensor Phalanx', nameDe: 'Sensorphalanx'},
  {type: BuildingType.polaronPowerPlant, nameEn: 'Polaron Power Plant', nameDe: 'Polaronkraftwerk'},
  {type: BuildingType.dualParticleAccelerator, nameEn: 'Dual Particle Accelerator', nameDe: 'Doppelbeschleuniger'},
  {type: BuildingType.advancedResearchCenter, nameEn: 'Adv. Research Center', nameDe: 'Adv. Forschungszentrum'},
  {type: BuildingType.spaceElevator, nameEn: 'Space Elevator', nameDe: 'Orbitalseil'},
  {type: BuildingType.torpedoFactory, nameEn: 'Torpedo Factory', nameDe: 'Torpedofabrik'},
  {type: BuildingType.soriumMine, nameEn: 'Sorium Mine', nameDe: 'Sorium-Förderanlage'},
  {type: BuildingType.plasmaConverter, nameEn: 'Plasma Converter', nameDe: 'Plasmakonverter'},
  {type: BuildingType.disruptorBattery, nameEn: 'Disruptor Battery', nameDe: 'Disruptorbatterie'},
  {type: BuildingType.phaseMutator, nameEn: 'Phase Mutator', nameDe: 'Phasenmutator'},
  {type: BuildingType.activePhaseMutator, nameEn: 'Active Phase Mutator', nameDe: 'Aktiver Phasenmutator'},
  {type: BuildingType.recreationCenter, nameEn: 'Recreation Center', nameDe: 'Erholungszentrum'},
  {type: BuildingType.labourCamp, nameEn: 'Labour Camp', nameDe: 'Arbeitslager'},
  {type: BuildingType.debrisField, nameEn: 'Debris Field', nameDe: 'Trümmerfeld'},
];

describe('german language buildings regex', () => {
  test("test all German building types with random names", () => {
    buildingDatabase.forEach(buildingEntry => {
      // generate random alphanumeric string
      const name = Math.random().toString(36).slice(2);
      const buildingString = name + "(" + buildingEntry.nameDe + ")";
      
      const resultObject = Building.matchResult(buildingString);
      expect(resultObject).not.toBeNull();
      expect(resultObject.name).toBe(name);
      expect(resultObject.type).toBe(buildingEntry.type);
      expect(resultObject.asDisplayString()).toBe(String.raw`${name} (${buildingEntry.type.enumKey})`);
    });
  });
  test("test all German building types without names", () => {
    buildingDatabase.forEach(buildingEntry => {
      const resultObject = Building.matchResult(buildingEntry.nameDe);
      expect(resultObject).not.toBeNull();
      expect(resultObject.name).toBeNull();
      expect(resultObject.type).toBe(buildingEntry.type);
      expect(resultObject.asDisplayString()).toBe(buildingEntry.type.enumKey);
    });
  });
  test("test all English building types with random names", () => {
    buildingDatabase.forEach(buildingEntry => {
      // generate random alphanumeric string
      const name = Math.random().toString(36).slice(2);
      const buildingString = name + "(" + buildingEntry.nameEn + ")";
      
      const resultObject = Building.matchResult(buildingString);
      expect(resultObject).not.toBeNull();
      expect(resultObject.name).toBe(name);
      expect(resultObject.type).toBe(buildingEntry.type);
      expect(resultObject.asDisplayString()).toBe(String.raw`${name} (${buildingEntry.type.enumKey})`);
    });
  });
  test("test all English building types without names", () => {
    buildingDatabase.forEach(buildingEntry => {
      const resultObject = Building.matchResult(buildingEntry.nameEn);
      expect(resultObject).not.toBeNull();
      expect(resultObject.name).toBeNull();
      expect(resultObject.type).toBe(buildingEntry.type);
      expect(resultObject.asDisplayString()).toBe(buildingEntry.type.enumKey);
    });
  });
});
