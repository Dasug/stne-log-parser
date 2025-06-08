import { beforeEach, describe, expect, test } from '@jest/globals';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import WeaponShot from '../../src/statistics/weapon-shot.js';
import Statistics from '../../src/statistics/statistics.js';

describe('individual ship statistics', () => {
  /**
   * @type {Statistics}
   */
  let statistics;
  beforeEach(() => {
    statistics = new Statistics();
  });
  test("hit rate", () => {
    const originShip = new ShipNameOnlyResult;
    originShip.name = "origin";
    const targetShip = new ShipNameOnlyResult;
    targetShip.name = "target";

    const [origin, target] = statistics.register(originShip, targetShip);

    const shot1 = new WeaponShot({
      shotHasHit: false,
      origin: origin,
      target: target,
    });

    const shot2 = new WeaponShot({
      shotHasHit: true,
      origin: origin,
      target: target,
    });

    const shot3 = new WeaponShot({
      shotHasHit: false,
      origin: origin,
      target: target,
    });
    
    origin.addFiredShot(shot1);
    origin.addFiredShot(shot2);    
    origin.addFiredShot(shot3);
    
    target.addReceivedShot(shot1);
    target.addReceivedShot(shot2);    
    target.addReceivedShot(shot3);    


    expect(origin.hitRate).toBeCloseTo(1/3);
    expect(target.hitByRate).toBeCloseTo(1/3);
  });


  test("damage calculations", () => {
    const originShip = new ShipNameOnlyResult;
    originShip.name = "origin";
    const targetShip = new ShipNameOnlyResult;
    targetShip.name = "target";

    const [origin, target] = statistics.register(originShip, targetShip);

    const shot1 = new WeaponShot({
      shotHasHit: true,
      origin: origin,
      target: target,
      hullDamage: 20,
      effectiveHullDamage: 18,
      shieldDamage: 30,
      effectiveShieldDamage: 10,
      energyDamage: 40,
      effectiveEnergyDamage: 2,
      armorAbsorption: 2,
      armorPenetration: 1,
    });

    const shot2 = new WeaponShot({
      shotHasHit: true,
      origin: origin,
      target: target,
      hullDamage: 10,
      effectiveHullDamage: 8,
      shieldDamage: 20,
      effectiveShieldDamage: 1,
      energyDamage: 30,
      effectiveEnergyDamage: 4,
      armorAbsorption: 3,
      armorPenetration: 2,
    });

    const shot3 = new WeaponShot({
      shotHasHit: false,
      origin: origin,
      target: target,
    });
    
    origin.addFiredShot(shot1);
    origin.addFiredShot(shot2);    
    origin.addFiredShot(shot3);
    
    target.addReceivedShot(shot1);
    target.addReceivedShot(shot2);    
    target.addReceivedShot(shot3);    


    expect(origin.hullDamageDealt).toBe(26);
    expect(origin.shieldDamageDealt).toBe(11);
    expect(origin.energyDamageDealt).toBe(6);
    expect(origin.opponentArmorAbsorption).toBe(5);
    expect(origin.opponentArmorPenetrated).toBe(3);


    expect(target.hullDamageReceived).toBe(26);
    expect(target.shieldDamageReceived).toBe(11);
    expect(target.energyDamageReceived).toBe(6);
    expect(target.armorAbsorption).toBe(5);
    expect(target.armorPenetration).toBe(3);
  });
});