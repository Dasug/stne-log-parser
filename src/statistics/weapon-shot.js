"use strict";

class WeaponShot {
  #weaponName = null;
  #hullDamage = 0;
  #shieldDamage = 0;
  #energyDamage= 0;
  #shotHasHit = false;
  #shotHasDestroyedTarget = false;
  #shotHasDisabledTarget = false;

  #effectiveHullDamage = 0;
  #effectiveShieldDamage = 0;
  #effectiveEnergyDamage = 0;
  #overkill = 0;
  #armorAbsorption = 0;
  #armorPenetration = 0;
  #damageMultiplier = 1;

  #origin = null;
  #target = null;

  /**
   * name of the weapon
   * @returns {?string}
   */
  get weaponName() { return this.#weaponName }
  /**
   * raw hull damage of the shot
   * @returns {number}
   */
  get hullDamage() { return this.#hullDamage }
  /**
   * raw shield damage of the shot
   * @returns {number}
   */
  get shieldDamage() { return this.#shieldDamage }
  /**
   * raw energy damage of the shot
   * @returns {number}
   */
  get energyDamage() { return this.#energyDamage }
  /**
   * whether the shot hit
   * @returns {boolean}
   */
  get shotHasHit() { return this.#shotHasHit }
  /**
   * whether the shot destroyed the target
   * @returns {boolean}
   */
  get shotHasDestroyedTarget() { return this.#shotHasDestroyedTarget }
  /**
   * whether the shot disabled the target
   * @returns {boolean}
   */
  get shotHasDisabledTarget() { return this.#shotHasDisabledTarget }
  /**
   * the effective hull damage of the shot after shield penetration, armor calculation and removing overkill
   * @returns {number}
   */
  get effectiveHullDamage() { return this.#effectiveHullDamage }
  /**
   * the effective shield damage after shield penetration 
   * @returns {number}
   */
  get effectiveShieldDamage() { return this.#effectiveShieldDamage }
  /**
   * the effective energy damage of the shot after shield and hull damage calculation
   * @returns {number}
   */
  get effectiveEnergyDamage() { return this.#effectiveEnergyDamage }
  /**
   * the overkill damage of the shot
   * @returns {number}
   */
  get overkill() { return this.#overkill }
  /**
   * the amount of damage wasted by overkilling the target
   * @returns {number}
   */
  get armorAbsorption() { return this.#armorAbsorption }
  /**
   * the amount of armor penetrated by the shot
   * @returns {number}
   */
  get armorPenetration() { return this.#armorPenetration }
  /**
   * the (detected) damage multiplier applied to this weapon shot by external factors (like avatars, items etc.)
   * 
   * there might be some additional damage modifiers applied that were not detected by the parser (eg. map field environmental effects, undetected items, etc)
   * @returns {number}
   */
  get damageMultiplier() { return this.#damageMultiplier }
  /**
   * the origin object of the shot
   * @returns {?IndividualShipStatistics}
   */
  get origin() { return this.#origin }
  /**
   * the target object of the shot
   * @returns {?IndividualShipStatistics}
   */
  get target() { return this.#target }

  /**
   * @param {Object} param - Object containing the information about the weapon shot
   * @param {?string} param.weaponName - name of the weapon that fired the shot
   * @param {?number} param.hullDamage - raw hull damage of the shot
   * @param {?number} param.shieldDamage - raw shield damage of the shot
   * @param {?number} param.energyDamage - raw energy damage of the shot
   * @param {?boolean} param.shotHasHit - did the shot hit its target?
   * @param {?boolean} param.shotHasDestroyedTarget - did the shot destroy its target?
   * @param {?boolean} param.shotHasDisabledTarget - did the shot disable its target?
   * @param {?number} param.effectiveHullDamage - effective hull damage of the shot after shield penetration, armor calculation and removing overkill
   * @param {?number} param.effectiveShieldDamage - effective shield damage after shield penetration 
   * @param {?number} param.effectiveEnergyDamage - effective energy damage of the shot after shield and hull damage calculation
   * @param {?number} param.overkill - amount of damage wasted by overkilling the target
   * @param {?number} param.armorAbsorption - amount of damage absorbed by the armor
   * @param {?number} param.armorPenetration - the amount of armor penetrated by the shot
   * @param {?number} param.damageMultiplier - damage modifier of the shot applied by external sources (items etc.)
   * @param {?IndividualShipStatistics} param.origin - the ship that fired the shot
   * @param {?IndividualShipStatistics} param.target - the ship that was hit by the shot
   */
  constructor({
    weaponName = null,
    hullDamage = 0,
    shieldDamage = 0,
    energyDamage= 0,
    shotHasHit = false,
    shotHasDestroyedTarget = false,
    shotHasDisabledTarget = false,
    effectiveHullDamage = 0,
    effectiveShieldDamage = 0,
    effectiveEnergyDamage = 0,
    overkill = 0,
    armorAbsorption = 0,
    armorPenetration = 0,
    damageMultiplier = 1,
    origin = null,
    target = null,
  } = {}) {
    this.#weaponName = weaponName;
    this.#hullDamage = hullDamage;
    this.#shieldDamage = shieldDamage;
    this.#energyDamage = energyDamage;
    this.#shotHasHit = shotHasHit;
    this.#shotHasDestroyedTarget = shotHasDestroyedTarget;
    this.#shotHasDisabledTarget = shotHasDisabledTarget;
    this.#effectiveHullDamage = effectiveHullDamage;
    this.#effectiveShieldDamage = effectiveShieldDamage;
    this.#effectiveEnergyDamage = effectiveEnergyDamage;
    this.#overkill = overkill;
    this.#armorAbsorption = armorAbsorption;
    this.#armorPenetration = armorPenetration;
    this.#damageMultiplier = damageMultiplier;
    this.#origin = origin;
    this.#target = target;
  }
}

export default WeaponShot;