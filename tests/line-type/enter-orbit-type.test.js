import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import EnterOrbitType from '../../src/line-type/enter-orbit-type.js';

describe('enter orbit line type', () => {
  test("has ship_movement tag", () => {
    expect(EnterOrbitType.getTags()).toEqual(expect.arrayContaining([LineTag.shipMovement]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "8  Thorium (NX-2517288, Patrouillenschiff) von []U.C.W[] LordLicht (73167) ist in den Orbit von [Kingdom] Koweston (23307) bei @987|654 eingeflogen." };

    expect(EnterOrbitType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("detects German exit log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "SHR New Horizon (2383586, DY-500) von DavoRian82 (73324) ist aus dem Orbit von Hydrolion (80940) bei 654|247 ausgetreten." };

    expect(EnterOrbitType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`8  Thorium (NX-2517288, Patrouillenschiff) von []U.C.W[] LordLicht (73167) ist in den Orbit von [Kingdom] Koweston (23307) bei @987|654 eingeflogen.` };
    const parseResult = EnterOrbitType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.colony).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2517288);
    expect(parseResult.ship.name).toBe("8  Thorium");
    expect(parseResult.ship.nccPrefix).toBe("NX");
    expect(parseResult.ship.shipClass).toBe("Patrouillenschiff");
    
    // owner
    expect(parseResult.owner.id).toBe(73167);
    expect(parseResult.owner.name).toBe("[]U.C.W[] LordLicht");
    expect(parseResult.owner.idPrefix).toBeNull();

    // colony
    expect(parseResult.colony.name).toBe("[Kingdom] Koweston");
    expect(parseResult.colony.id).toBe(23307);

    // sector
    expect(parseResult.sector.x).toBe(987);
    expect(parseResult.sector.y).toBe(654);
    expect(parseResult.sector.orbit).toBe(true);
  });

  test("parses German exit log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`SHR New Horizon (2383586, DY-500) von DavoRian82 (73324) ist aus dem Orbit von Hydrolion (80940) bei 654|247 ausgetreten.` };
    const parseResult = EnterOrbitType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.colony).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2383586);
    expect(parseResult.ship.name).toBe("SHR New Horizon");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("DY-500");
    
    // owner
    expect(parseResult.owner.id).toBe(73324);
    expect(parseResult.owner.name).toBe("DavoRian82");
    expect(parseResult.owner.idPrefix).toBeNull();

    // colony
    expect(parseResult.colony.name).toBe("Hydrolion");
    expect(parseResult.colony.id).toBe(80940);

    // sector
    expect(parseResult.sector.x).toBe(654);
    expect(parseResult.sector.y).toBe(247);
    expect(parseResult.sector.orbit).toBe(false);
  });
})