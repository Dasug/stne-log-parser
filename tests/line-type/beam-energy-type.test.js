import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import BeamTransportType from '../../src/enum/beam-transport-type.js';
import BeamDirection from '../../src/enum/beam-direction.js';
import BeamResource from '../../src/enum/beam-resource.js';
import BeamEnergyType from '../../src/line-type/beam-energy-type.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';

describe('beam energy line type', () => {
  test("has correct tags", () => {
    expect(BeamEnergyType.getTags()).toEqual(expect.arrayContaining([LineTag.transport]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`[Support] Amaryll NCC 1678153 transportiert in Sektor 0|0 7355,44 Warpkern zu =UDR= GanYMeD` };
    
    expect(BeamEnergyType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "[Support] Amaryll NCC 1678153 transportiert in Sektor 0|0 7355,44 Warpkern zu =UDR= GanYMeD" };
    const parseResult = BeamEnergyType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.transportType).not.toBeNull();
    expect(parseResult.beamDirection).not.toBeNull();
    expect(parseResult.resources).toBeInstanceOf(Array);
    expect(parseResult.items).toBeInstanceOf(Array);
    
    // parts are set correctly
    // ship
    expect(parseResult.ship).toBeInstanceOf(ShipNameOnlyResult);
    expect(parseResult.ship.name).toBe("[Support] Amaryll");
    expect(parseResult.ncc).toBe(1678153);

    // beamTarget
    expect(parseResult.beamTarget).toBeInstanceOf(ShipNameOnlyResult);
    expect(parseResult.beamTarget.name).toBe("=UDR= GanYMeD");

    // sector
    expect(parseResult.sector.x).toBe(0);
    expect(parseResult.sector.y).toBe(0);

    // transport type
    expect(parseResult.transportType).toBe(BeamTransportType.transport);

    // beam direction
    expect(parseResult.beamDirection).toBe(BeamDirection.toTarget);
    
    // no items
    expect(parseResult.items.length).toBe(0);

    // resources
    expect(parseResult.resources.length).toBe(1);
    const warpCore = parseResult.resources[0];

    expect(warpCore.resource).toBe(BeamResource.warpCore);
    expect(warpCore.amount).toBe(7355.44);
  });
})