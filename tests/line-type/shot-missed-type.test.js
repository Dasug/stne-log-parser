import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ShotMissedType from '../../src/line-type/shot-missed-type';

describe('shot missed line type', () => {
  test("has battle tag", () => {
    expect(ShotMissedType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.weaponShotResult]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Ifuat (2837138, Verlassene Klaestron) verfehlt das Ziel!` };
    
    expect(ShotMissedType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Warrior OI8497 (1658087, LX710b) misses its target!` };

    expect(ShotMissedType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Ifuat (2837138, Verlassene Klaestron) verfehlt das Ziel!` };
    const parseResult = ShotMissedType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2837138);
    expect(parseResult.ship.name).toBe("Ifuat");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Verlassene Klaestron");
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Warrior OI8497 (1658087, LX710b) misses its target!` };
    const parseResult = ShotMissedType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.station).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1658087);
    expect(parseResult.ship.name).toBe("Warrior OI8497");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("LX710b");
  });
})