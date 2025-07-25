"use strict";

import LineTag from "../enum/line-tag.js";
import ArmorAbsorptionResult from "../line-type/parse-result/armor-absorption-result.js";
import ArmorPenetrationResult from "../line-type/parse-result/armor-penetration-result.js";
import EnergyDamageResult from "../line-type/parse-result/energy-damage-result.js";
import FireWeaponResult from "../line-type/parse-result/fire-weapon-result.js";
import HullDamageResult from "../line-type/parse-result/hull-damage-result.js";
import ShieldDamageResult from "../line-type/parse-result/shield-damage-result.js";
import ShotMissedResult from "../line-type/parse-result/shot-missed-result.js";
import WeaponShot from './weapon-shot.js';
import LogLine from "../log-line.js";
import PlayerNameAndIdResult from "../regex/parse-result/player-name-and-id-result.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";
import ShipNameOnlyResult from "../regex/parse-result/ship-name-only-result.js";
import IndividualPlayerCharacterStatistics from "./individual-player-character-statistics.js";
import IndividualShipStatistics from "./individual-ship-statistics.js";
import PlayerCharacterStatistics from "./player-character-statistics.js";
import ShipStatistics from "./ship-statistics.js";
import ColonyStatistics from "./colony-statistics.js";
import ColonyNameAndIdResult from "../regex/parse-result/colony-name-and-id-result.js";
import AvatarStatistics from "./avatar-statistics.js";
import AvatarResult from "../regex/parse-result/avatar-result.js";
import AvatarDamageReductionResult from "../line-type/parse-result/avatar-damage-reduction-result.js";
import AvatarDecoyDroneSuccessResult from "../line-type/parse-result/avatar-decoy-drone-success-result.js";
import AvatarAttackDroneCritResult from "../line-type/parse-result/avatar-attack-drone-crit-result.js";
import IndividualAvatarStatistics from "./individual-avatar-statistics.js";
import AvatarWeaponDamageIncreaseResult from "../line-type/parse-result/avatar-weapon-damage-increase-result.js";
import AvatarPilotManeuverSuccessResult from "../line-type/parse-result/avatar-pilot-maneuver-success-result.js";
/**
 * A parse result of a ship, either with only name or with name and NCC and class
 * @typedef {ShipNameAndNccResult|ShipNameOnlyResult} ShipParseResult
 */

/**
 * A parse result that can be registered in the statistics
 * @typedef {ShipResult|PlayerNameAndIdResult|ColonyNameAndIdResult} RegisterableParseResult
 */

/**
 * Statistics object for an individual object
 * @typedef {IndividualPlayerCharacterStatistics|IndividualShipStatistics} IndividualStatisticsObject
 */

class Statistics {
  /**
   * Contains statistics related to ships used in the log(s)
   * @type {ShipStatistics}
   */
  ships;

  /**
   * Contains statistics related to player characters mentioned in the log(s)
   * @type {PlayerCharacterStatistics}
   */
  playerCharacters;

  /**
   * Contains statistics related to colonies used in the log(s)
   * @type {ColonyStatistics}
   */
  colonies;

  /**
   * Contains statistics related to avatars used in the log(s)
   * @type {AvatarStatistics}
   */
  avatars;

  /**
   * shorthand to register a ship, its owner and the ownership relationship between them.
   * @param {ShipNameAndNccResult|ShipNameOnlyResult|null} ship ship to register
   * @param {?PlayerNameAndIdResult} owner player character to register 
   * @returns {{ship: ?IndividualShipStatistics, owner: ?IndividualPlayerCharacterStatistics}} registered ship and player character objects
   */
  registerShipAndOwner(ship, owner) {
    let shipStatistics = null;
    if(ship instanceof ShipNameAndNccResult || ship instanceof ShipNameOnlyResult) {
      shipStatistics = this.ships.registerShip(ship);
    }

    let ownerStatistics = null;
    if(owner instanceof PlayerNameAndIdResult) {
      ownerStatistics = this.playerCharacters.registerPlayerCharacter(owner);
      shipStatistics.setOwner(ownerStatistics);
    }
    return {ship: shipStatistics, owner: ownerStatistics};
  }

  /**
   * shorthand to register any number of registerable parse result, will be sent to the proper registration functions
   * @param  {...?RegisterableParseResult} parseResultObjects parse result objects to register
   * @returns {(?IndividualStatisticsObject)[]} statistics objects for the registered objects or null if not registerable
   */
  register(...parseResultObjects) {
    return parseResultObjects.map(parseResult => {
      if(parseResult instanceof ShipNameAndNccResult || parseResult instanceof ShipNameOnlyResult) {
        return this.ships.registerShip(parseResult);
      }
      if(parseResult instanceof PlayerNameAndIdResult) {
        return this.playerCharacters.registerPlayerCharacter(parseResult);
      }
      if(parseResult instanceof ColonyNameAndIdResult) {
        return this.colonies.registerColony(parseResult);
      }
      if(parseResult instanceof AvatarResult) {
        return this.avatars.registerAvatar(parseResult);
      }
      return null;
    });
  }

  /**
   * finds the first log line containing the given tag
   * @param {LogLine[]} attack log lines to search for the tag
   * @param {LineTag} tag tag to search for
   * @returns {?LogLine}
   */
  #attackGetLineByTag(attack, tag) {
    return attack.filter(/** @var {logLine} */ line => line.tags.includes(tag))[0] ?? null;
  }

  /**
   * finds the first log line containing the given tag
   * @param {LogLine[]} attack log lines to search for the tag
   * @param {LineTag} tag tag to search for
   * @returns {?LogLine}
   */
  #attackGetLineByParseResultType(attack, parseResultClass) {
    return attack.filter(/** @var {logLine} */ line => line.parseResult instanceof parseResultClass)[0] ?? null;
  }

  /**
   * finds all log lines containing the given tag
   * @param {LogLine[]} attack log lines to search for the tag
   * @param {LineTag} tag tag to search for
   * @returns {LogLine[]}
   */
  #attackGetLinesByTag(attack, tag) {
    return attack.filter(/** @var {logLine} */ line => line.tags.includes(tag));
  }
  /**
   * Processes the destruction of a ship
   * @param {?IndividualShipStatistics} shotOrigin origin object that fired the shot 
   * @param {LogLine} shipDestructionLine line in which the ship was destroyed
   * @param {LogLine} weaponShotLine line in which the weapon was shot
   */
  #processShipDestruction(shotOrigin, shipDestructionLine) {
    if(shipDestructionLine !== null) {
      const [destroyedShip] = this.register(shipDestructionLine.parseResult.ship);
      destroyedShip.setDestroyer(shotOrigin);
      if(shotOrigin instanceof IndividualShipStatistics) {
        shotOrigin.addDestroyedObject(destroyedShip);
      }
    }
  }
  
  /**
   * 
   * @param {LogLine[]} attack array of log lines constituting an attack
   * @param {LogLine} weaponShotLine log line that shows the weapon being fired
   */
  #buildShot(attack, weaponShotLine) {
    /**
     * @type {FireWeaponResult}
     */
    const shotParseResults = weaponShotLine.parseResult;
    const [shotOrigin, shotTarget] = this.register(shotParseResults.origin, shotParseResults.target);
    const shotHasHit = this.#attackGetLineByParseResultType(attack, ShotMissedResult) === null;
    const shotHasDestroyedTarget = this.#attackGetLineByTag(attack, LineTag.shipDestruction) !== null;
    const shotHasDisabledTarget = this.#attackGetLineByTag(attack, LineTag.shipDisabled) !== null;
    const hullDamageLine = this.#attackGetLineByParseResultType(attack, HullDamageResult);
    const shieldDamageLine = this.#attackGetLineByParseResultType(attack, ShieldDamageResult);
    const energyDamageLine = this.#attackGetLineByParseResultType(attack, EnergyDamageResult);
    const armorAbsorptionLine = this.#attackGetLineByParseResultType(attack, ArmorAbsorptionResult);
    const armorPenetrationLine = this.#attackGetLineByParseResultType(attack, ArmorPenetrationResult);
    const avatarDamageReductionLine = this.#attackGetLineByParseResultType(attack, AvatarDamageReductionResult);
    const avatarAttackDroneCritLine = this.#attackGetLineByParseResultType(attack, AvatarAttackDroneCritResult);
    const avatarPilotManeuverSuccessLine = this.#attackGetLineByParseResultType(attack, AvatarPilotManeuverSuccessResult);
    const avatarWeaponDamageIncreaseLine = this.#attackGetLineByParseResultType(attack, AvatarWeaponDamageIncreaseResult);

    // calculate applied damage modifier
    let damageMultiplier = 1;
    // defense tactician avatar
    damageMultiplier *= 1-(avatarDamageReductionLine?.parseResult.damageReduction ?? 0)/100;
    // drone pilot avatar
    if(avatarAttackDroneCritLine !== null) {
      damageMultiplier *= 2;
    }
    // pilot avatar
    if(avatarPilotManeuverSuccessLine !== null) {
      damageMultiplier *= 2;
    }
    // weapon officier avatar
    damageMultiplier *= 1+(avatarWeaponDamageIncreaseLine?.parseResult.damageIncrease ?? 0)/100;

    const shot = new WeaponShot({
      origin: shotOrigin,
      target: shotTarget,
      weaponName: shotParseResults.weaponName,
      shotHasHit: shotHasHit,
      shotHasDestroyedTarget: shotHasDestroyedTarget,
      shotHasDisabledTarget: shotHasDisabledTarget,
      hullDamage: shotParseResults.weaponStrength.hullDamage,
      shieldDamage: shotParseResults.weaponStrength.shieldDamage,
      energyDamage: shotParseResults.weaponStrength.energyDamage,
      effectiveHullDamage: hullDamageLine?.parseResult.hullDamage ?? 0,
      overkill: hullDamageLine?.parseResult.overkillDamage ?? 0,
      effectiveShieldDamage: shieldDamageLine?.parseResult.shieldDamage ?? 0,
      effectiveEnergyDamage: energyDamageLine?.parseResult.energyDamage ?? 0,
      armorAbsorption: armorAbsorptionLine?.parseResult.armorAbsorption ?? 0,
      armorPenetration: armorPenetrationLine?.parseResult.armorPenetration ?? 0,
      damageMultiplier: damageMultiplier,
    });

    if(shotOrigin !== null) {
      shotOrigin.addFiredShot(shot);
    }
    if(shotTarget !== null) {
      shotTarget.addReceivedShot(shot);
    }

    return shot;
  }

  #processAvatarActions(attack, shot) {
    const avatarDamageReductionLine = this.#attackGetLineByParseResultType(attack, AvatarDamageReductionResult);
    if(shot !== null && avatarDamageReductionLine !== null) {
      /** @type {[IndividualAvatarStatistics]} */
      const [avatar] = this.register(avatarDamageReductionLine.parseResult.avatar);
      const damageReductionPercentage = avatarDamageReductionLine.parseResult.damageReduction / 100;
      const originalHullDamage = Math.ceil(shot.hullDamage / (1-damageReductionPercentage));
      const originalShieldDamage = Math.ceil(shot.shieldDamage / (1-damageReductionPercentage));
      const originalEnergyDamage = Math.ceil(shot.energyDamage / (1-damageReductionPercentage));
      const hullDamageReduction = originalHullDamage - shot.hullDamage;
      const shieldDamageReduction = originalShieldDamage - shot.shieldDamage;
      const energyDamageReduction = originalEnergyDamage - shot.energyDamage;
      avatar.registerHullDamageReduction(hullDamageReduction);
      avatar.registerShieldDamageReduction(shieldDamageReduction);
      avatar.registerEnergyDamageReduction(energyDamageReduction);
    }

    const avatarDecoyDroneSuccessLine = this.#attackGetLineByParseResultType(attack, AvatarDecoyDroneSuccessResult);
    if(avatarDecoyDroneSuccessLine !== null) {
      /** @type {[IndividualAvatarStatistics, ?IndividualShipStatistics]} */
      const [avatar, opponent] = this.register(avatarDecoyDroneSuccessLine.parseResult.avatar, avatarDecoyDroneSuccessLine.parseResult.opponent);
      avatar.registerAvoidedShot(avatarDecoyDroneSuccessLine.parseResult.weaponName, opponent);
    }
  }

  #processWeaponShot(attack, weaponShotLine) {
    const shot = weaponShotLine !== null ? this.#buildShot(attack, weaponShotLine) : null;
    this.#processAvatarActions(attack, shot);
  }

  /**
   * 
   * @param {LogLine[]} attack array of log lines constituting a single attack.
   * @see {@link LogEntry#findAttacks}
   */
  processAttack(attack) {
    const weaponShotLine = this.#attackGetLineByTag(attack, LineTag.weaponShot);
    const shipDestructionLine = this.#attackGetLineByTag(attack, LineTag.shipDestruction);
    const shipDisablingLine = this.#attackGetLineByTag(attack, LineTag.shipDisabled);
    const [shotOrigin] = this.register(weaponShotLine?.parseResult?.origin);
    if(shipDestructionLine !== null) {
      this.#processShipDestruction(shotOrigin, shipDestructionLine);
    }
    this.#processWeaponShot(attack, weaponShotLine);
  }

  processAttacks(attacks) {
    attacks.forEach(attack => this.processAttack(attack));
  }

  constructor() {
    this.ships = new ShipStatistics;
    this.playerCharacters = new PlayerCharacterStatistics;
    this.colonies = new ColonyStatistics;
    this.avatars = new AvatarStatistics;
  }
}

export default Statistics;