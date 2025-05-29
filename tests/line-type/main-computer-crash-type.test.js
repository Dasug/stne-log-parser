import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import MainComputerCrashType from '../../src/line-type/main-computer-crash-type.js';

describe('main computer crash line type', () => {
  const lineTypeClass = MainComputerCrashType;
  test("has battle and ship disabled tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.shipDisabled]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Paiso (2831277, Verlassenes Tug) von Die Verdammten (NPC-76936) ist der Hauptcomputer abgestürzt!" };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": "Warrior OI8497 (1658087, LX710b) experiences a system crash, causing the main computer to go down!" };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Paiso (2831277, Verlassenes Tug) von Die Verdammten (NPC-76936) ist der Hauptcomputer abgestürzt!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2831277);
    expect(parseResult.ship.name).toBe("Paiso");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Verlassenes Tug");
    
    // owner
    expect(parseResult.owner.id).toBe(76936);
    expect(parseResult.owner.name).toBe("Die Verdammten");
    expect(parseResult.owner.idPrefix).toBe("NPC");
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Warrior OI8497 (1658087, LX710b) experiences a system crash, causing the main computer to go down!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1658087);
    expect(parseResult.ship.name).toBe("Warrior OI8497");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("LX710b");
  });
})