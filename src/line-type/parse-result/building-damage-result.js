"use strict"

import BuildingResult from "../../regex/parse-result/building-result.js";
import SurfaceCoordinatesResult from "../../regex/parse-result/surface-coordinates-result.js";

class BuildingDamageResult {
  /**
   * building type that was daMaged
   * @type {BuildingResult}
   */
  building;

  /**
   * surface position of the building that took damage
   * @type {SurfaceCoordinatesResult}
   */
  position;

  /**
   * name of the weapon that was used to inflict damage to the building
   * @type {string}
   */
  weaponName;

  /**
   * damage taken by the hull
   * 
   * overkill is not mentioned in the log message so if the building got destroyed,
   * this is probably overestimating the actual damage.
   * @type {number}
   */
  hullDamage;

  /**
   * remaining hull strength
   * @type {number}
   */
  remainingHullStrength;
}

export default BuildingDamageResult;