import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import TractorBeamStruggleCostType from '../../src/line-type/tractor-beam-struggle-cost-type.js';

describe('tractor beam struggle cost line type', () => {
  test("has correct tags", () => {
    expect(TractorBeamStruggleCostType.getTags()).toEqual(expect.arrayContaining([LineTag.tractorBeam]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Beim Versuch sich vom Traktorstrahl von =MS= Aquilon Kratos loszureißen verbraucht [Scout] Deudi 1 Energie und 8,33 Gondeln!` };
    
    expect(TractorBeamStruggleCostType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Beim Versuch sich vom Traktorstrahl von =MS= Aquilon Kratos loszureißen verbraucht [Scout] Deudi 1 Energie und 8,33 Gondeln!" };
    const parseResult = TractorBeamStruggleCostType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.ship).toBeInstanceOf(ShipNameOnlyResult);
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.target).toBeInstanceOf(ShipNameOnlyResult);
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.name).toBe("=MS= Aquilon Kratos");
    
    // target
    expect(parseResult.target.name).toBe("[Scout] Deudi");

    expect(parseResult.energyCost).toBeCloseTo(1);
    expect(parseResult.flightRangeCost).toBeCloseTo(8.33);
  });
})