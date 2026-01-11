"use strict"

class AtmoshpereAbsorptionResult {
  /**
   * name of the weapon that got partially absorbed by the atmosphere.
   * Might always be called Phaser regardless of the actual weapon's name
   * due to STNE legacy functionality.
   * @type {string}
   */
  weaponName;

  /** 
   * points of damage absorbed by the atmosphere
   * @type {number}
  */
  atmosphereAbsorption;
}

export default AtmoshpereAbsorptionResult;
