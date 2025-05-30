import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import TractorBeamLockType from '../../src/line-type/tractor-beam-lock-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('tractor beam lock line type', () => {
  const lineTypeClass = TractorBeamLockType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.tractorBeam]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`=MS= Hivemother Hexara erfasst in Sektor(141|526) die [Scout] Deudi mit einem Traktorstrahl.` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "=MS= Hivemother Hexara erfasst in Sektor(141|526) die [Scout] Deudi mit einem Traktorstrahl." };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.ship).toBeInstanceOf(ShipNameOnlyResult);
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.target).toBeInstanceOf(ShipNameOnlyResult);
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.name).toBe("=MS= Hivemother Hexara");
    
    // target
    expect(parseResult.target.name).toBe("[Scout] Deudi");
    
    // sector
    expect(parseResult.sector.x).toBe(141);
    expect(parseResult.sector.y).toBe(526);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`=MS= Hivemother Hexara erfasst in Sektor(141|526) die [Scout] Deudi mit einem Traktorstrahl.` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByName("=MS= Hivemother Hexara");
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBeNull();
    expect(ship.name).toBe("=MS= Hivemother Hexara");
    const ship2 = statistics.ships.getShipByName("[Scout] Deudi");
    expect(ship2).not.toBeNull();
    expect(ship2.ncc).toBeNull();
    expect(ship2.name).toBe("[Scout] Deudi");
  });
})