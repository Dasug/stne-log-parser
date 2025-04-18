"use strict"

import { Enumify } from "enumify";

class BuildingType extends Enumify {
  static baseCamp = new BuildingType();
  static farm = new BuildingType();
  static solarCells = new BuildingType();
  static naturePreserve = new BuildingType();
  static storageCompound = new BuildingType();
  static colonyHeadquarters = new BuildingType();
  static solarArray = new BuildingType();
  static plasteelFactory = new BuildingType();
  static town = new BuildingType();
  static iridiumMine = new BuildingType();
  static duraniumFactory = new BuildingType();
  static dilithiumMine = new BuildingType();
  static hydroponicDome = new BuildingType();
  static habitatDome = new BuildingType();
  static workBeeSpaceport = new BuildingType();
  static solarSatellite = new BuildingType();
  static flowTurbine = new BuildingType();
  static algaeFarm = new BuildingType();
  static city = new BuildingType();
  static phaserCannon = new BuildingType();
  static headquarters = new BuildingType();
  static hydrolysisFacility = new BuildingType();
  static fusionReactor = new BuildingType();
  static beamBlocker = new BuildingType();
  static tunnelSystem = new BuildingType();
  static radiationCollector = new BuildingType();
  static orbitalShipyard = new BuildingType();
  static weatherControlStation = new BuildingType();
  static geothermalPowerPlant = new BuildingType();
  static industrialReplicator = new BuildingType();
  static nitriumMine = new BuildingType();
  static tritaniumFactory = new BuildingType();
  static particleAccelerator = new BuildingType();
  static warpCore = new BuildingType();
  static researchCenter = new BuildingType();
  static subsurfaceStorageFacility = new BuildingType();
  static scanBlocker = new BuildingType();
  static jupiterStation = new BuildingType();
  static shieldTower = new BuildingType();
  static orbitalHabitat = new BuildingType();
  static phaserBattery = new BuildingType();
  static torpedoBattery = new BuildingType();
  static subspaceTelescope = new BuildingType();
  static sensorPhalanx = new BuildingType();
  static polaronPowerPlant = new BuildingType();
  static dualParticleAccelerator = new BuildingType();
  static advancedResearchCenter = new BuildingType();
  static spaceElevator = new BuildingType();
  static torpedoFactory = new BuildingType();
  static soriumMine = new BuildingType();
  static plasmaConverter = new BuildingType();
  static disruptorBattery = new BuildingType();
  static phaseMutator = new BuildingType();
  static activePhaseMutator = new BuildingType();

  // credit buildings
  static recreationCenter = new BuildingType();
  static labourCamp = new BuildingType();

  // not buildable but can be obtained through other means
  static debrisField = new BuildingType();

  // exotic buildings, referenced in STNE script engine but not obtainable
  static excavationSite = new BuildingType();
  static intelligenceAgencyCenter = new BuildingType();
  static energyGenerator = new BuildingType();
  static disintegrator = new BuildingType();
  static deuteriumTank = new BuildingType();
  static smallShipyard = new BuildingType();

  // fallback in case there's ever a new building type
  static unknown = new BuildingType();
  
  static _ = this.closeEnum();
  
}

export default BuildingType;