import { describe, expect, test } from '@jest/globals';
import DockingType from '../../src/line-type/docking-type';

describe('docking line type', () => {
  test("has ship_movement and docking tag", () => {
    expect(DockingType.getTags()).toEqual(expect.arrayContaining(["ship_movement", "docking"]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`[Support] Kapir (2450112, Assimilator) dockt im Sektor @888|777 an [Starbase] New Koweston an` };
    
    expect(DockingType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`IMoovStufToo (1593773, Silverstar) von Loki (83929) docks to =VIPER= Landa Station in sector 555|666` };

    expect(DockingType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`[Support] Kapir (2450112, Assimilator) dockt im Sektor @888|777 an [Starbase] New Koweston an` };
    const parseResult = DockingType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.station).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2450112);
    expect(parseResult.ship.name).toBe("[Support] Kapir");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Assimilator");
    
    // station
    expect(parseResult.station.name).toBe("[Starbase] New Koweston");

    // sector
    expect(parseResult.sector.x).toBe(888);
    expect(parseResult.sector.y).toBe(777);
    expect(parseResult.sector.orbit).toBe(true);
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`IMoovStufToo (1593773, Silverstar) von Loki (83929) docks to =VIPER= Landa Station in sector 555|666` };
    const parseResult = DockingType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.station).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1593773);
    expect(parseResult.ship.name).toBe("IMoovStufToo");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Silverstar");
    
    // owner
    expect(parseResult.owner.id).toBe(83929);
    expect(parseResult.owner.name).toBe("Loki");
    expect(parseResult.owner.idPrefix).toBeNull();
  });
})