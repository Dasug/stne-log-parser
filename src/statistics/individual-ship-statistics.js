"use strict";

import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import ShipNameOnlyResult from "../regex/parse-result/ship-name-only-result.js";
import IndividualPlayerCharacterStatistics from "./individual-player-character-statistics.js";
import WeaponShot from "./weapon-shot.js";

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
   * how much shield damage has the ship dealt?
   * @type {Number}
   */
  #hullDamageDealt = 0;
  /**
   * how much energy damage has the ship dealt?
   * @type {Number}
   */
  #energyDamageDealt = 0;
  /**
   * how much shield damage has the ship dealt?
   * @type {Number}
   */
  #shieldDamageDealt = 0;
  /**
   * how much damage was wasted by overkilling opponents?
   * @type {Number}
   */
  #overkillDamageDealt = 0;
  /**
   * how much damage this ship dealt was absorbed by opponents' armor?
   * @type {Number}
   */
  #opponentArmorAbsorption = 0;
  /**
   * how much damage was absorbed by the ship's armor?
   * @type {Number}
   */
  #armorAbsorption = 0;
  /**
   * how much damage absorbtion was foiled by opponents' armor penetration?
   * @type {Number}
   */
  #armorPenetration = 0;
  /**
   * how much of opponents' damage absorbtion was avoided by armor penetration?
   * @type {Number}
   */
  #opponentArmorPenetrated = 0;
  /**
   * which ship of other object has this ship been destroyed by?
   * @type {?IndividualShipStatistics}
   */
  #destroyer;
  /**
   * which ships of other objects has this ship destroyed
   * @type {(?IndividualShipStatistics)[]}
   */
  #destroyed = [];
  /**
   * list of shots fired by the ship
   * @type {WeaponShot[]}
   */
  #shotsFired = [];
  /**
   * list of shots received by the ship
   * @type {WeaponShot[]}
   */
  #shotsReceived = [];
  /**
   * shot that this ship has been destroyed by
   * @type {?WeaponShot}
   */
  #destroyedByShot = null;
  /**
   * shot that this ship has been disabled by
   * @type {?WeaponShot}
   */
  #disabledByShot = null;

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
  get hullDamageDealt() {
    return this.#hullDamageDealt;
  }
  get energyDamageDealt() {
    return this.#energyDamageDealt;
  }
  get shieldDamageDealt() {
    return this.#shieldDamageDealt;
  }
  get overkillDamageDealt() {
    return this.#overkillDamageDealt;
  }
  /**
   * @returns {Number} The total damage dealt by the ship to hulls and shields, ignoring overkill damage.
   */
  get effectiveDamageDealt() {
    return this.hullDamageDealt + this.shieldDamageDealt;
  }
  /**
   * @returns {Number} The total damage dealt by the ship to hulls and shields, including damage wasted by overkill.
   */
  get totalDamageDealt() {
    return this.hullDamageDealt + this.shieldDamageDealt + this.overkillDamageDealt;
  }
  get armorAbsorption() {
    return this.#armorAbsorption;
  }
  get opponentArmorAbsorption() {
    return this.#opponentArmorAbsorption;
  }
  get armorPenetration() {
    return this.#armorPenetration;
  }
  get opponentArmorPenetrated() {
    return this.#opponentArmorPenetrated;
  }
  get destroyer() {
    return this.#destroyer ?? null;
  }
  get destroyed() {
    return this.#destroyed;
  }
  get shotsFired() {
    return this.#shotsFired;
  }
  get shotsReceived() {
    return this.#shotsReceived;
  }
  get destroyedByShot() {
    return this.#destroyedByShot;
  }
  get disabledByShot() {
    return this.#disabledByShot;
  }
  /**
   * @returns {Number} number of objetcs this ship has destroyed
   */
  get destroyedNum() {
    return this.#destroyed.length;
  }
  /**
   * @returns {?Number} ratio of shots hit by this object or null if the ship hasn't shot anything
   */
  get hitRate() {
    const shotFiredNum = this.#shotsFired.length;
    if(shotFiredNum === 0) {
      return null;
    }
    return this.#shotsFired.filter(shot => shot.shotHasHit).length / shotFiredNum;
  }


  /**
   * @returns {?Number} ratio of shots this ship was hit by or null if the shiphas never been shot at
   */
  get hitByRate() {
    const shotReceivedNum = this.#shotsReceived.length;
    if(shotReceivedNum === 0) {
      return null;
    }
    return this.#shotsReceived.filter(shot => shot.shotHasHit).length / shotReceivedNum;
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
   * apply armor penetration to a ship
   * @param {Number} damage amount damage absorbed by armor
   */
  applyArmorPenetration(damage) {
    this.#armorPenetration += damage;
  }

  /**
   * apply hull damage dealt to an opponent
   * @param {Number} damage amount of hull damage received
   */
  applyDealtHullDamage(damage) {
    this.#hullDamageDealt += damage;
  }

  /**
   * apply shield damage dealt to an opponent
   * @param {Number} damage amount of shield damage received
   */
  applyDealtShieldDamage(damage) {
    this.#shieldDamageDealt += damage;
  }

  /**
   * apply energy damage dealt to an opponent
   * @param {Number} damage amount of energy damage received
   */
  applyDealtEnergyDamage(damage) {
    this.#energyDamageDealt += damage;
  }

  /**
   * apply overkill damage dealt to an opponent
   * @param {Number} damage amount of overkill damage received
   */
  applyDealtOverkillDamage(damage) {
    this.#overkillDamageDealt += damage;
  }

  /**
   * apply armor absorption by opponents against this ship's attack
   * @param {Number} damage amount damage absorbed by armor
   */
  applyOpponentArmorAbsorption(damage) {
    this.#opponentArmorAbsorption += damage;
  }

  /**
   * apply armor penetration against an opponent
   * @param {Number} damage amount damage absorbed by armor
   */
  applyOpponentArmorPenetrated(damage) {
    this.#opponentArmorPenetrated += damage;
  }

  /**
   * add a shot to the list of shots fired by this ship
   * @param {WeaponShot} shot fired shot
   */
  addFiredShot(shot) {
    this.#shotsFired.push(shot);

    this.applyDealtHullDamage(shot.effectiveHullDamage ?? 0);
    this.applyDealtShieldDamage(shot.effectiveShieldDamage ?? 0);
    this.applyDealtEnergyDamage(shot.effectiveEnergyDamage ?? 0);
    this.applyDealtOverkillDamage(shot.overkill ?? 0);
    this.applyOpponentArmorPenetrated(shot.armorPenetration ?? 0);
    this.applyOpponentArmorAbsorption(shot.armorAbsorption ?? 0);
  }

  /**
   * add a shot to the list of shots received by this ship
   * @param {WeaponShot} shot - fired shot
   */
  addReceivedShot(shot) {
    this.#shotsReceived.push(shot);
    if(shot.shotHasDisabledTarget) {
      this.#disabledByShot = shot;
    }
    if(shot.shotHasDestroyedTarget) {
      this.#destroyedByShot = shot;
    }

    this.applyHullDamage(shot.effectiveHullDamage ?? 0);
    this.applyShieldDamage(shot.effectiveShieldDamage ?? 0);
    this.applyEnergyDamage(shot.effectiveEnergyDamage ?? 0);
    this.applyOverkillDamage(shot.overkill ?? 0);
    this.applyArmorAbsorption(shot.armorAbsorption ?? 0);
    this.applyArmorPenetration(shot.armorPenetration ?? 0);
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

  /**
   * Merges another ship's statistics into this ship
   * @param {IndividualShipStatistics} ship other ship's statistics 
   */
  mergeShipData(ship) {
    this.#name = this.#name ?? ship.name;
    this.#ncc = this.#ncc ?? ship.ncc;
    this.#nccPrefix = this.#nccPrefix ?? ship.nccPrefix;
    this.#shipClass = this.#shipClass ?? ship.shipClass;
    this.#isDestroyed = this.#isDestroyed || ship.isDestroyed;
    this.#hullDamageReceived = this.#hullDamageReceived + ship.hullDamageReceived;
    this.#energyDamageReceived = this.#energyDamageReceived + ship.energyDamageReceived;
    this.#shieldDamageReceived = this.#shieldDamageReceived + ship.shieldDamageReceived;
    this.#overkillDamageReceived = this.#overkillDamageReceived + ship.overkillDamageReceived;
    this.#hullDamageDealt = this.#hullDamageDealt + ship.hullDamageDealt;
    this.#energyDamageDealt = this.#energyDamageDealt + ship.energyDamageDealt;
    this.#shieldDamageDealt = this.#shieldDamageDealt + ship.shieldDamageDealt;
    this.#overkillDamageDealt = this.#overkillDamageDealt + ship.overkillDamageDealt;
    this.#opponentArmorAbsorption = this.#opponentArmorAbsorption + ship.opponentArmorAbsorption;
    this.#armorAbsorption = this.#armorAbsorption + ship.armorAbsorption;
    this.#armorPenetration = this.#armorPenetration + ship.armorPenetration;
    this.#opponentArmorPenetrated = this.#opponentArmorPenetrated + ship.opponentArmorPenetrated;
    this.#destroyer = this.#destroyer ?? ship.destroyer;
    this.#destroyed = [...this.#destroyed, ...ship.destroyed];
    this.#shotsFired = [...this.#shotsFired, ...ship.shotsFired];
    this.#shotsReceived = [...this.#shotsReceived, ...ship.shotsReceived];
    this.#destroyedByShot = this.#destroyedByShot ?? ship.destroyedByShot;
    this.#disabledByShot = this.#disabledByShot ?? ship.disabledByShot;
    if(this.owner !== ship.owner && this.owner === null) {
      this.setOwner(ship.owner);
    }

    return this;
  }
  
  constructor() {

  }
}

export default IndividualShipStatistics;
