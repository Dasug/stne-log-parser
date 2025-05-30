import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import EnergyDamageType from '../../src/line-type/energy-damage-type';
import Statistics from '../../src/statistics/statistics.js';

describe('energy damage line type', () => {
  const lineTypeClass = EnergyDamageType;
  test("has correct tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.weaponShotResult, LineTag.damage]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Hauptenergie von Fara * (2788187, D7) sinkt um 98, von 568,18 auf 470,18` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  // synthetic log line, replace with actual one if available!
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Main energy of Warrior OI8497 (1658087, LX710b) sinks by 20, from 255 to 253` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Hauptenergie von Fara * (2788187, D7) sinkt um 98, von 568,18 auf 470,18` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2788187);
    expect(parseResult.ship.name).toBe("Fara *");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("D7");

    expect(parseResult.energyDamage).toBeCloseTo(98);
    expect(parseResult.energyBefore).toBeCloseTo(568.18);
    expect(parseResult.remainingEnergy).toBeCloseTo(470.18);
    expect(parseResult.shipDisabled).toBe(false);
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Main energy of Warrior OI8497 (1658087, LX710b) sinks by 20, from 255 to 235` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1658087);
    expect(parseResult.ship.name).toBe("Warrior OI8497");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("LX710b");

    expect(parseResult.energyDamage).toBeCloseTo(20);
    expect(parseResult.energyBefore).toBeCloseTo(255);
    expect(parseResult.remainingEnergy).toBeCloseTo(235);
    expect(parseResult.shipDisabled).toBe(false);
  });

  test("parses German entry log line with ship disabled as the outcome", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Hauptenergie von Fara * (2788187, D7) sinkt um 123,18, von 123,18 auf 0, und fällt aus!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2788187);
    expect(parseResult.ship.name).toBe("Fara *");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("D7");

    expect(parseResult.energyDamage).toBeCloseTo(123.18);
    expect(parseResult.energyBefore).toBeCloseTo(123.18);
    expect(parseResult.remainingEnergy).toBeCloseTo(0);
    expect(parseResult.shipDisabled).toBe(true);
  });

  test("parses English entry log line with ship disabled as the outcome", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Warrior OI8497 (1658087, LX710b)'s main batteries lose 10 energy and fail.` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1658087);
    expect(parseResult.ship.name).toBe("Warrior OI8497");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("LX710b");

    expect(parseResult.energyDamage).toBeCloseTo(10);
    expect(parseResult.energyBefore).toBeCloseTo(10);
    expect(parseResult.remainingEnergy).toBeCloseTo(0);
    expect(parseResult.shipDisabled).toBe(true);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Hauptenergie von Fara * (2788187, D7) sinkt um 98, von 568,18 auf 470,18` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2788187);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2788187);
    expect(ship.name).toBe("Fara *");
  });
})