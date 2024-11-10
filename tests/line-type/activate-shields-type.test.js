import { describe, expect, test } from '@jest/globals';
import ActivateShieldsType from '../../src/line-type/activate-shields-type';
import LineTag from '../../src/enum/line-tag.js';

describe('activate shields line type', () => {
  test("has correct tags", () => {
    expect(ActivateShieldsType.getTags()).toEqual(expect.arrayContaining([LineTag.battle]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`TS-4465-O-6465 (1372249, -) von Mortarion [OBV] * * * (28076) aktiviert die Schilde` };
    
    expect(ActivateShieldsType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`TRES Sarajevo (1577151, Crossfield) von ROBYN BANKS Mad Tyrant of {=BSC=} (72133) raises shields` };

    expect(ActivateShieldsType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "TS-4465-O-6465 (1372249, -) von Mortarion [OBV] * * * (28076) aktiviert die Schilde" };
    const parseResult = ActivateShieldsType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // owner
    expect(parseResult.owner.id).toBe(28076);
    expect(parseResult.owner.name).toBe("Mortarion [OBV] * * *");
    // ship
    expect(parseResult.ship.ncc).toBe(1372249);
    expect(parseResult.ship.name).toBe("TS-4465-O-6465");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("-");
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`TRES Sarajevo (1577151, Crossfield) von ROBYN BANKS Mad Tyrant of {=BSC=} (72133) raises shields` };
    const parseResult = ActivateShieldsType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // owner
    expect(parseResult.owner.id).toBe(72133);
    expect(parseResult.owner.name).toBe("ROBYN BANKS Mad Tyrant of {=BSC=}");
    // ship
    expect(parseResult.ship.ncc).toBe(1577151);
    expect(parseResult.ship.name).toBe("TRES Sarajevo");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Crossfield");
  });
})