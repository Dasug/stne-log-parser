import { describe, expect, test } from '@jest/globals';
import TractorBeamDragAlongType from '../../src/line-type/tractor-beam-drag-along-type.js';
import LineTag from '../../src/enum/line-tag.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import TractorBeamLockType from '../../src/line-type/tractor-beam-lock-type.js';

describe('tractor beam lock line type', () => {
  test("has correct tags", () => {
    expect(TractorBeamLockType.getTags()).toEqual(expect.arrayContaining([LineTag.tractorBeam]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`=MS= Hivemother Hexara erfasst in Sektor(141|526) die [Scout] Deudi mit einem Traktorstrahl.` };
    
    expect(TractorBeamLockType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "=MS= Hivemother Hexara erfasst in Sektor(141|526) die [Scout] Deudi mit einem Traktorstrahl." };
    const parseResult = TractorBeamLockType.parse(testLogEntry.entry, testLogEntry.lang);

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
})