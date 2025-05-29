import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import HullDamageType from '../../src/line-type/hull-damage-type';

describe('hull damage line type', () => {
  const lineTypeClass = HullDamageType;
  test("has correct tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.weaponShotResult, LineTag.damage]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Ishol (2837352, Verlassene Bandari) nimmt 4 Schaden, Hüllenintegrität sinkt auf 398` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Warrior OI8497 (1658087, LX710b) takes 8 damage, hull integrity is reduced to 10` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Ishol (2837352, Verlassene Bandari) nimmt 4 Schaden, Hüllenintegrität sinkt auf 398` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2837352);
    expect(parseResult.ship.name).toBe("Ishol");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Verlassene Bandari");

    expect(parseResult.hullDamage).toBe(4);
    expect(parseResult.remainingHullStrength).toBe(398);
    expect(parseResult.overkillDamage).toBe(0);
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Warrior OI8497 (1658087, LX710b) takes 8 damage, hull integrity is reduced to 10` };
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

    expect(parseResult.hullDamage).toBe(8);
    expect(parseResult.remainingHullStrength).toBe(10);
    expect(parseResult.overkillDamage).toBe(0);
  });

  test("parses German entry log line with overkill correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`U.S.S. Dracaix (2819313, Korolev) nimmt 46(+3) Schaden, Hüllenintegrität sinkt auf 0` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2819313);
    expect(parseResult.ship.name).toBe("U.S.S. Dracaix");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Korolev");

    expect(parseResult.hullDamage).toBe(46);
    expect(parseResult.remainingHullStrength).toBe(0);
    expect(parseResult.overkillDamage).toBe(3);
  });

  test("parses English entry log line with overkill correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Warrior OI8497 (1658087, LX710b) takes 2(+15) damage, hull integrity is reduced to 0` };
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

    expect(parseResult.hullDamage).toBe(2);
    expect(parseResult.remainingHullStrength).toBe(0);
    expect(parseResult.overkillDamage).toBe(15);
  });
})