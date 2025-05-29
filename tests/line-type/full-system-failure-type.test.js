import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import FullSystemFailureType from '../../src/line-type/full-system-failure-type.js';

describe('full system failure line type', () => {
  const lineTypeClass = FullSystemFailureType;
  test("has battle, ship disabled and redundant tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.shipDisabled, LineTag.redundant]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Paiso (2831277, Verlassenes Tug) erleidet einen Ausfall aller Systeme, das Schiff wird Starthilfe brauchen um wieder flott gemacht zu werden!" };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": "Warrior OI8497 (1658087, LX710b) suffers a full system failure. The ship will need assistance before it can start back up!" };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Paiso (2831277, Verlassenes Tug) erleidet einen Ausfall aller Systeme, das Schiff wird Starthilfe brauchen um wieder flott gemacht zu werden!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2831277);
    expect(parseResult.ship.name).toBe("Paiso");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Verlassenes Tug");
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Warrior OI8497 (1658087, LX710b) suffers a full system failure. The ship will need assistance before it can start back up!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1658087);
    expect(parseResult.ship.name).toBe("Warrior OI8497");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("LX710b");
  });
})