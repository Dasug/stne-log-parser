"use strict"

import AvatarJob from "../enum/avatar-job.js";
import AvatarResult from "../regex/parse-result/avatar-result.js";
import IndividualShipStatistics from "./individual-ship-statistics.js";
import WeaponShot from "./weapon-shot.js";

class IndividualAvatarStatistics {
  /** 
   * name of the avatar
   * @type {?String}
  */
  #name;
  /**
   * item id of the avatar 
   * @type {?Number}
  */
  #itemId;

  /**
   * job of the avatar
   * @type {?AvatarJob}
   */
  #job;

  /**
   * total number of actions performed by the avatar 
   * @type {Number}
   */
  #totalActions = 0;
  
  /**
   * number of successful actions performed by the avatar 
   * @type {Number}
   */
  #successfulActions = 0;

  /**
   * points of hull damage the avatar managed to avoid
   * @type {Number}
   */
  #hullDamageReduction = 0;
  
  /**
   * points of shield damage the avatar managed to avoid
   * @type {Number}
   */
  #shieldDamageReduction = 0;
  
  /**
   * points of energy damage the avatar managed to avoid
   * @type {Number}
   */
  #energyDamageReduction = 0;

  /**
   * shots that have been avoided by this avatar but the weapon used is unknown
   * @type {{weaponName: String, shotOrigin: ?IndividualShipStatistics}[]}
   */
  #unknownAvoidedShots = [];

  /** 
   * name of the avatar
   * @type {?String}
  */
  get name() {
    return this.#name ?? null;
  }

  /**
   * item id of the avatar 
   * @type {?Number}
  */
  get itemId() {
    return this.#itemId ?? null;
  }

  /**
   * job of the avatar
   * @type {AvatarJob}
   */
  get job() {
    return this.#job ?? AvatarJob.unknown;
  }

  /**
   * total number of actions performed by the avatar 
   * @type {Number}
   */
  get totalActions() {
    return this.#totalActions;
  }

  /**
   * number of successful actions performed by the avatar 
   * @type {Number}
   */
  get successfulActions() {
    return this.#successfulActions;
  }

  /**
   * number of unsuccessful actions performed by the avatar 
   * @type {Number}
   */
  get unsuccessfulActions() {
    return this.#totalActions - this.#successfulActions;
  }

  /**
   * success rate of the avatar's actions or null if total actions is zero 
   * @type {?Number}
   */
  get successRate() {
    if(this.#totalActions === 0) {
      return null;
    }
    return this.#successfulActions / this.#totalActions;
  }

  /**
   * number of hull damage points that have been avoided by this avatar
   * 
   * This is theoretical damage, eg. just the difference between final shot strength and shot strength before the damage reduction 
   * @type {Number}
   */
  get hullDamageReduction() {
    return this.#hullDamageReduction;
  }

  /**
   * number of shield damage points that have been avoided by this avatar
   * 
   * This is theoretical damage, eg. just the difference between final shot strength and shot strength before the damage reduction 
   * @type {Number}
   */
  get shieldDamageReduction() {
    return this.#shieldDamageReduction;
  }

  /**
   * number of energy damage points that have been avoided by this avatar
   * 
   * This is theoretical damage, eg. just the difference between final shot strength and shot strength before the damage reduction 
   * @type {Number}
   */
  get energyDamageReduction() {
    return this.#energyDamageReduction;
  }

  /**
   * shots that have been avoided by this avatar but the weapon used is unknown
   * @type {{weaponName: String, shotOrigin: ?IndividualShipStatistics}[]}
   */
  get unknownAvoidedShots() {
    return this.#unknownAvoidedShots;
  }

  /**
   * register an action performed by the avatar 
   */
  registerAction() {
    this.#totalActions++;
  }

  /**
   * register a successful action performed by the avatar.
   * Does not increment the total action amount, be sure to register an action first
   */
  registerActionSuccess() {
    this.#successfulActions++;
  }

  /**
   * Registers hull damage reduced by the avatar
   * @param {Number} damageReduction amount of hull damage reduced by the avatar. This refers to the weapon shot strength before hit detection, armor absorption etc.
   */
  registerHullDamageReduction(damageReduction) {
    this.#hullDamageReduction += damageReduction;
  }

  /**
   * Registers shield damage reduced by the avatar
   * @param {Number} damageReduction amount of shield damage reduced by the avatar. This refers to the weapon shot strength before hit detection, armor absorption etc.
   */
  registerShieldDamageReduction(damageReduction) {
    this.#shieldDamageReduction += damageReduction;
  }

  /**
   * Registers energy damage reduced by the avatar
   * @param {Number} damageReduction amount of energy damage reduced by the avatar. This refers to the weapon shot strength before hit detection, armor absorption etc.
   */
  registerEnergyDamageReduction(damageReduction) {
    this.#energyDamageReduction += damageReduction;
  }

  /**
   * processes an avoided shot
   * @returns {boolean} true if the shot could be processed, false if it couldn't. (shotOrigin is null of the weapon is not known)
   */
  #processAvoidedShot(weaponName, shotOrigin) {
    if(shotOrigin === null) {
      return false;
    }
    // shot origin doesn't yet collect shots fired information
    if(typeof shotOrigin.shotsFired === "undefined") {
      return false;
    }
    const weaponShots = shotOrigin.shotsFired.filter(/** @type {WeaponShot} */ weaponShot => weaponShot.weaponName === weaponName);
    if(weaponShots.length === 0) {
      return false;
    }

    // calculate average in case the actual base damage is ambiguous
    let avgOriginalHullDamage = Math.round(weaponShots.reduce((damageTotal, weaponShot) => (damageTotal + weaponShot.hullDamage / weaponShot.damageMultiplier), 0) / weaponShots.length);
    let avgOriginalShieldDamage = Math.round(weaponShots.reduce((damageTotal, weaponShot) => (damageTotal + weaponShot.shieldDamage / weaponShot.damageMultiplier), 0) / weaponShots.length);
    let avgOriginalEnergyDamage = Math.round(weaponShots.reduce((damageTotal, weaponShot) => (damageTotal + weaponShot.energyDamage / weaponShot.damageMultiplier), 0) / weaponShots.length);

    this.registerHullDamageReduction(avgOriginalHullDamage);
    this.registerShieldDamageReduction(avgOriginalShieldDamage);
    this.registerEnergyDamageReduction(avgOriginalEnergyDamage);

    return true;
  }

  /**
   * register that the avatar managed to avoid a shot at the ship he is stationed on.
   * 
   * this will register damage reduction for the avatar if the weapon's base shot strength is known.
   * This is inferred if a weapon shot has been registered before this function is called.
   *  
   * @param {?IndividualShipStatistics} shotOrigin origin of the shot
   * @param {String} weaponName name of the weapon the avatar avoided
   */
  registerAvoidedShot(weaponName, shotOrigin) {
    if(!this.#processAvoidedShot(weaponName, shotOrigin)) {
      this.#unknownAvoidedShots.push({weaponName, shotOrigin});
    }
  }

  /**
   * updates the avatars's basic data using an avatar parse result
   * Do not use outside of {@link AvatarStatistics#registerAvatar}, as doing so will break the avatar registration!
   * If you need to manually update the basic avatar data, use {@link AvatarStatistics#registerAvatar}!
   * @param {AvatarResult} avatar - A parse result for an avatar
   */
  _updateAvatarDataFromParseResult(avatar) {
    this.#itemId = avatar.itemId ?? this.#itemId;
    this.#name = avatar.name ?? this.#name;
    this.#job = avatar.job ?? this.#job;
  }
}

export default IndividualAvatarStatistics;
