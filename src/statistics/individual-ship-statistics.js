"use strict";

import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import ShipNameOnlyResult from "../regex/parse-result/ship-name-only-result.js";
import IndividualPlayerCharacterStatistics from "./individual-player-character-statistics.js";

class IndividualShipStatistics {
  /**
   * @type {?String}
   */
  #name;
  /**
   * @type {?Number}
   */
  #ncc;
  /**
   * @type {?String}
   */
  #nccPrefix;
  /**
   * @type {?String}
   */
  #shipClass;
  /**
   * @type {?IndividualPlayerCharacterStatistics}
   */
  #owner;
  /**
   * is the ship destroyed
   * @type {boolean}
   */
  #isDestroyed = false;
  /**
   * how much shield damage has the ship received?
   * @type {Number}
   */
  #hullDamageReceived = 0;
  /**
   * how much energy damage has the ship received?
   * @type {Number}
   */
  #energyDamageReceived = 0;
  /**
   * how much shield damage has the ship received?
   * @type {Number}
   */
  #shieldDamageReceived = 0;
  /**
   * how much damage was wasted by overkilling the ship?
   * @type {Number}
   */
  #overkillDamageReceived = 0;
  /**
   * how much damage was absorbed by the ship's armor?
   * @type {Number}
   */
  #armorAbsorption = 0;
  /**
   * which ship of other object has this ship been destroyed by?
   * @type {?IndividualShipStatistics}
   */
  #destroyer;
  /**
   * which weapon has this ship been destroyed by?
   * @type {?IndividualShipStatistics}
   */
  #destroyedByWeapon;
  /**
   * which ships of other objects has this ship destroyed
   * @type {(?IndividualShipStatistics)[]}
   */
  #destroyed = [];
  
  get name() {
    return this.#name ?? null;
  }
  get ncc() {
    return this.#ncc ?? null;
  }
  get nccPrefix() {
    return this.#nccPrefix ?? null;
  }
  get shipClass() {
    return this.#shipClass ?? null;
  }
  get owner() {
    return this.#owner ?? null;
  }
  get isDestroyed() {
    return this.#isDestroyed;
  }
  get hullDamageReceived() {
    return this.#hullDamageReceived;
  }
  get energyDamageReceived() {
    return this.#energyDamageReceived;
  }
  get shieldDamageReceived() {
    return this.#shieldDamageReceived;
  }
  get overkillDamageReceived() {
    return this.#overkillDamageReceived;
  }
  get armorAbsorption() {
    return this.#armorAbsorption;
  }
  get destroyer() {
    return this.#destroyer ?? null;
  }
  get destroyedByWeapon() {
    return this.#destroyedByWeapon ?? null;
  }
  get destroyed() {
    return this.#destroyed;
  }
  /**
   * @returns {Number} number of objetcs this ship has destroyed
   */
  get destroyedNum() {
    return this.#destroyed.length;
  }

  hasBasicData() {
    return this.name !== null && this.ncc !== null && this.shipClass !== null; 
  }

  /**
   * mark the ship as destroyed
   */
  destroyShip() {
    this.#isDestroyed = true;
  }

  /**
   * Sets the destroyer of this ship
   * @param {?IndividualShipStatistics} destroyer ship or other object that destroyed this ship 
   */
  setDestroyer(destroyer) {
    this.#destroyer = destroyer;
  }

  /**
   * Sets the weapon this ship was destroyed by
   * @param {?String} weapon weapon that this ship was destroyed by 
   */
  setDestroyedByWeapon(weapon) {
    this.#destroyedByWeapon  = weapon;
  }

  /**
   * Adds a ship or other object to the list of objects destroyed by this ship
   * @param {?IndividualShipStatistics} destroyed ship or other object 
   */
  addDestroyedObject(destroyedObject) {
    this.#destroyed.push(destroyedObject);
  }

  /**
   * apply hull damage to a ship
   * @param {Number} damage amount of hull damage received
   */
  applyHullDamage(damage) {
    this.#hullDamageReceived += damage;
  }

  /**
   * apply shield damage to a ship
   * @param {Number} damage amount of shield damage received
   */
  applyShieldDamage(damage) {
    this.#shieldDamageReceived += damage;
  }

  /**
   * apply energy damage to a ship
   * @param {Number} damage amount of energy damage received
   */
  applyEnergyDamage(damage) {
    this.#energyDamageReceived += damage;
  }

  /**
   * apply overkill damage to a ship
   * @param {Number} damage amount of overkill damage received
   */
  applyOverkillDamage(damage) {
    this.#overkillDamageReceived += damage;
  }

  /**
   * apply armor damage absorption to a ship
   * @param {Number} damage amount damage absorbed by armor
   */
  applyArmorAbsorption(damage) {
    this.#armorAbsorption += damage;
  }

  /**
   * Updates the ship's NCC
   * Do not use outside of {@link ShipStatistics#updateShipNcc}, as doing so will break the ship registration!
   * If you need to manually update the NCC, use {@link ShipStatistics#updateShipNcc}!
   * @param {Number} ncc new NCC number
   */
  _updateNcc(ncc) {
    this.#ncc = ncc;
  }

  /**
   * updates the ship basic data using a ship parse result
   * Do not use outside of {@link ShipStatistics#registerShip}, as doing so will break the ship registration!
   * If you need to manually update the basic ship data, use {@link ShipStatistics#registerShip}!
   * @param {ShipNameAndNccResult|ShipNameOnlyResult} shipParseResult A parse result for a ship, either only name or with NCC data
   */
  _updateShipDataFromParseResult(shipParseResult) {
    if(shipParseResult instanceof ShipNameAndNccResult) {
      this.#name = shipParseResult.name;
      this.#ncc = shipParseResult.ncc;
      this.#nccPrefix = shipParseResult.nccPrefix;
      this.#shipClass = shipParseResult.shipClass;
    } else if(shipParseResult instanceof ShipNameOnlyResult) {
      this.#name = shipParseResult.name;
    }
  }

  /**
   * Marks the owner of this ship.
   * Does not perform player character registration so make sure the owner is registered first using {@link PlayerCharacterStatistics#registerPlayerCharacter} if you want them to be registered.
   * @param {IndividualPlayerCharacterStatistics} playerCharacter player character that owns this ship
   */
  setOwner(playerCharacter) {
    this.#owner = playerCharacter;
    playerCharacter._addShip(this);
  }
  
  constructor() {

  }
}

export default IndividualShipStatistics;