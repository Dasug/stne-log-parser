"use strict"

import { Enumify } from "enumify";

class MapFieldType extends Enumify {
  static smallAsteroidField = new MapFieldType();
  static largeAsteroidField = new MapFieldType();
  static moderatePlanet = new MapFieldType();
  static desertPlanet = new MapFieldType();
  static icePlanet = new MapFieldType();
  static standardPlanet = new MapFieldType();
  static waterPlanet = new MapFieldType();
  static rockyPlanet = new MapFieldType();
  static iceAsteroid = new MapFieldType();
  static sourceOfTheAnomaly = new MapFieldType();
  static anomaly = new MapFieldType();
  static lavaPlanet = new MapFieldType();
  static neutronStar = new MapFieldType();
  static dysonSphere = new MapFieldType();
  static sparseDeuteriumNebula = new MapFieldType();
  static denseDeuteriumNebula = new MapFieldType();
  static metaphasicNebula = new MapFieldType();
  static metrionGasNebula = new MapFieldType();
  static ceruleanNebula = new MapFieldType();
  static radioactiveNebula = new MapFieldType();
  static interior = new MapFieldType();
  static powerConduit = new MapFieldType();
  static plasmaConduit = new MapFieldType();
  static wall = new MapFieldType();
  static subspaceRift = new MapFieldType();
  static quantumSingularity = new MapFieldType();
  static space = new MapFieldType();
  static deepSpace = new MapFieldType();
  static darkSpace = new MapFieldType();

  static unknown = new MapFieldType();
  static _ = this.closeEnum();  
}

export default MapFieldType;