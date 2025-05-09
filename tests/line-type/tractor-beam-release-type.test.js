import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import TractorBeamReleaseType from '../../src/line-type/tractor-beam-release-type.js';

describe('tractor beam release line type', () => {
  test("has correct tags", () => {
    expect(TractorBeamReleaseType.getTags()).toEqual(expect.arrayContaining([LineTag.tractorBeam]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`=MS= Hivemother Hexara löst in Sektor(141|526) bei [Scout] Deudi den Traktorstrahl.` };
    
    expect(TractorBeamReleaseType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "=MS= Hivemother Hexara löst in Sektor(141|526) bei [Scout] Deudi den Traktorstrahl." };
    const parseResult = TractorBeamReleaseType.parse(testLogEntry.entry, testLogEntry.lang);

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