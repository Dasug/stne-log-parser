import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import SystemBlockadeType from '../../src/line-type/system-blockade-type.js';
import SystemBlockadeState from '../../src/enum/system-blockade-state.js';

describe('system blockade line type', () => {
  test("has correct tags", () => {
    expect(SystemBlockadeType.getTags()).toEqual(expect.arrayContaining([LineTag.shipMaintenance, LineTag.systemBlockade]));
  });
  test("detects German raised log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "H|K ~KS~ Wrong Way (2563440, Atel) hat im Sektor 229|423 eine Systemblockade errichtet" };

    expect(SystemBlockadeType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("detects German dropped log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "H|K ~KS~ Wrong Way (2563440, Atel) hat im Sektor 229|423 die Systemblockade aufgegeben" };

    expect(SystemBlockadeType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German raise log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`H|K ~KS~ Wrong Way (2563440, Atel) hat im Sektor 229|423 eine Systemblockade errichtet` };
    const parseResult = SystemBlockadeType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.state).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2563440);
    expect(parseResult.ship.name).toBe("H|K ~KS~ Wrong Way");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Atel");
    
    // sector
    expect(parseResult.sector.x).toBe(229);
    expect(parseResult.sector.y).toBe(423);
    expect(parseResult.sector.orbit).toBe(false);

    // state
    expect(parseResult.state).toBe(SystemBlockadeState.raised);
  });

  test("parses German drop log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`H|K ~KS~ Wrong Way (2563440, Atel) hat im Sektor 229|423 die Systemblockade aufgegeben` };
    const parseResult = SystemBlockadeType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.state).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2563440);
    expect(parseResult.ship.name).toBe("H|K ~KS~ Wrong Way");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Atel");
    
    // sector
    expect(parseResult.sector.x).toBe(229);
    expect(parseResult.sector.y).toBe(423);
    expect(parseResult.sector.orbit).toBe(false);

    // state
    expect(parseResult.state).toBe(SystemBlockadeState.dropped);
  });
})