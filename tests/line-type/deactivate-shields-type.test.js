import { describe, expect, test } from '@jest/globals';
import DeactivateShieldsType from '../../src/line-type/deactivate-shields-type';

describe('deactivate shields line type', () => {
  test("has correct tags", () => {
    expect(DeactivateShieldsType.getTags()).toEqual(expect.arrayContaining(["battle"]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`[IRV] Odysseus (2509111, Hurricane) von Tal’Shiar (75203) deaktiviert die Schilde` };
    
    expect(DeactivateShieldsType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`TRES Sarajevo (1577151, Crossfield) von ROBYN BANKS Mad Tyrant of {=BSC=} (72133) deactivates the shields` };

    expect(DeactivateShieldsType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "[IRV] Odysseus (2509111, Hurricane) von Tal’Shiar (75203) deaktiviert die Schilde" };
    const parseResult = DeactivateShieldsType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // owner
    expect(parseResult.owner.id).toBe(75203);
    expect(parseResult.owner.name).toBe("Tal’Shiar");
    // ship
    expect(parseResult.ship.ncc).toBe(2509111);
    expect(parseResult.ship.name).toBe("[IRV] Odysseus");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Hurricane");
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`TRES Sarajevo (1577151, Crossfield) von ROBYN BANKS Mad Tyrant of {=BSC=} (72133) deactivates the shields` };
    const parseResult = DeactivateShieldsType.parse(testLogEntry.entry, testLogEntry.lang);

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