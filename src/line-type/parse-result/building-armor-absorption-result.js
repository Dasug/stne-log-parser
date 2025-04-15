"use strict"

import SurfaceCoordinatesResult from "../../regex/parse-result/surface-coordinates-result.js";

class BuildingArmorAbsorptionResult {
  /** 
   * points of damage absorbed by the armor
   * @type {number}
  */
  armorAbsorption;

  /**
   * points of strength of the weapon shot remaining after armor absorption
   * @type {number}
   */
  weaponStrengthRemaining;
  
  /**
   * name of the weapon shot
   * @type {string}
   */
  weaponName;

  /**
   * coordinates of the building that was hit
   * @type {SurfaceCoordinatesResult}
   */
  position;
}

export default BuildingArmorAbsorptionResult;