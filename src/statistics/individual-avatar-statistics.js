"use strict"

import AvatarJob from "../enum/avatar-job.js";
import AvatarResult from "../regex/parse-result/avatar-result.js";

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