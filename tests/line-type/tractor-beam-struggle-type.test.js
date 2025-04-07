import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import TractorBeamReleaseType from '../../src/line-type/tractor-beam-release-type.js';
import TractorBeamStruggleType from '../../src/line-type/tractor-beam-struggle-type.js';

describe('tractor beam struggle line type', () => {
  test("has correct tags", () => {
    expect(TractorBeamStruggleType.getTags()).toEqual(expect.arrayContaining([LineTag.tractorBeam]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`[Scout] Deudi versucht sich vom Traktorstrahl von =MS= Hivemother Hexara loszureißen!` };
    
    expect(TractorBeamStruggleType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "[Scout] Deudi versucht sich vom Traktorstrahl von =MS= Hivemother Hexara loszureißen!" };
    const parseResult = TractorBeamStruggleType.parse(testLogEntry.entry, testLogEntry.lang);

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
  });
})