import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ArmorAbsorptionType from '../../src/line-type/armor-absorption-type';

describe('armor absorption line type', () => {
  test("has battle tag", () => {
    expect(ArmorAbsorptionType.getTags()).toEqual(expect.arrayContaining([LineTag.battle]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Panzerung von U.S.S. Dracaix (2819313, Korolev) schwächt Angriff um 1 Punkte` };
    
    expect(ArmorAbsorptionType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Armor of Warrior OI8497 (1658087, LX710b) weakens the attack by 1 points.` };

    expect(ArmorAbsorptionType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Panzerung von U.S.S. Dracaix (2819313, Korolev) schwächt Angriff um 1 Punkte` };
    const parseResult = ArmorAbsorptionType.parse(testLogEntry.entry, testLogEntry.lang);

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
    
    expect(parseResult.armorAbsorption).toBe(1);
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Armor of Warrior OI8497 (1658087, LX710b) weakens the attack by 2 points.` };
    const parseResult = ArmorAbsorptionType.parse(testLogEntry.entry, testLogEntry.lang);

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
    
    expect(parseResult.armorAbsorption).toBe(2);
  });
})