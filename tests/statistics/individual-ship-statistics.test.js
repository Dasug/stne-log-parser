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
});