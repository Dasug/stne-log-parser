import { beforeEach, describe, expect, test } from '@jest/globals';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
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

  test("merge ship", () => {
    const ship1 = new ShipNameAndNccResult;
    ship1.name = "Test Ship 1";
    ship1.ncc = 1234;
    const ship2 = new ShipNameAndNccResult;
    ship2.name = "Test Ship 2";
    ship2.ncc = 34567;
    ship2.nccPrefix = "NX-";
    ship2.shipClass = "Test Ship";
    const targetShip = new ShipNameOnlyResult;
    targetShip.name = "target";

    const [registeredShip1, registeredShip2, target] = statistics.register(ship1, ship2, targetShip);

    const shot1 = new WeaponShot({
      shotHasHit: true,
      origin: registeredShip1,
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
      origin: registeredShip2,
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
      origin: registeredShip1,
      target: target,
    });
    
    registeredShip1.addFiredShot(shot1);
    registeredShip2.addFiredShot(shot2);    
    registeredShip1.addFiredShot(shot3);
    
    target.addReceivedShot(shot1);
    target.addReceivedShot(shot2);    
    target.addReceivedShot(shot3);

    registeredShip1.mergeShipData(registeredShip2);

    expect(registeredShip1.name).toBe("Test Ship 1");
    expect(registeredShip1.ncc).toBe(1234);
    expect(registeredShip1.nccPrefix).toBe("NX-");
    expect(registeredShip1.shipClass).toBe("Test Ship");
    expect(registeredShip1.isDestroyed).toBe(false);
    expect(registeredShip1.hullDamageReceived).toBe(0);
    expect(registeredShip1.energyDamageReceived).toBe(0);
    expect(registeredShip1.shieldDamageReceived).toBe(0);
    expect(registeredShip1.overkillDamageReceived).toBe(0);
    expect(registeredShip1.hullDamageDealt).toBe(26);
    expect(registeredShip1.energyDamageDealt).toBe(6);
    expect(registeredShip1.shieldDamageDealt).toBe(11);
    expect(registeredShip1.overkillDamageDealt).toBe(0);
    expect(registeredShip1.opponentArmorAbsorption).toBe(5);
    expect(registeredShip1.opponentArmorPenetrated).toBe(3);
    expect(registeredShip1.destroyer).toBeNull();
    expect(registeredShip1.destroyed.length).toBe(0);
    expect(registeredShip1.shotsFired.length).toBe(3);
    expect(registeredShip1.shotsReceived.length).toBe(0);
    expect(registeredShip1.destroyedByShot).toBeNull();
    expect(registeredShip1.disabledByShot).toBeNull();
  });
});
