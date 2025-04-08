import { describe, expect, test } from '@jest/globals';
import ActivateOverdriveType from '../../src/line-type/activate-overdrive-type.js';
import LineTag from '../../src/enum/line-tag.js';
import ActivateWeaponsType from '../../src/line-type/activate-weapons-type.js';
import WeaponsState from '../../src/enum/weapons-state.js';

describe('activate overdrive line type', () => {
  test("has correct tags", () => {
    expect(ActivateWeaponsType.getTags()).toEqual(expect.arrayContaining([LineTag.shipMaintenance]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Drelio (2307399, Darinaya) von ||acw||PRIAM (75323) aktiviert die Waffensysteme` };
    
    expect(ActivateWeaponsType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Oxosk (1568612, Cloverfield) activates its weapons systems` };

    expect(ActivateWeaponsType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Drelio (2307399, Darinaya) von ||acw||PRIAM (75323) aktiviert die Waffensysteme" };
    const parseResult = ActivateWeaponsType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.state).not.toBeNull();
    
    // parts are set correctly
    // owner
    expect(parseResult.owner.id).toBe(75323);
    expect(parseResult.owner.name).toBe("||acw||PRIAM");
    // ship
    expect(parseResult.ship.ncc).toBe(2307399);
    expect(parseResult.ship.name).toBe("Drelio");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Darinaya");
    
    // state
    expect(parseResult.state).toBe(WeaponsState.active);
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Oxosk (1568612, Cloverfield) activates its weapons systems` };
    const parseResult = ActivateWeaponsType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.state).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1568612);
    expect(parseResult.ship.name).toBe("Oxosk");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Cloverfield");
    
    // state
    expect(parseResult.state).toBe(WeaponsState.active);
  });
})