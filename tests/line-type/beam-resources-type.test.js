import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import BeamResourcesType from '../../src/line-type/beam-resources-type.js';
import BeamTransportType from '../../src/enum/beam-transport-type.js';
import BeamDirection from '../../src/enum/beam-direction.js';
import BeamResource from '../../src/enum/beam-resource.js';

describe('beam resources line type', () => {
  test("has correct tags", () => {
    expect(BeamResourcesType.getTags()).toEqual(expect.arrayContaining([LineTag.transport]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Sprungkosten (69307, Sovereign Refit) beamt in Sektor 45|16 Waren von Huasiurk (71828, AntaresB): Deuterium: 200. Sorium: 10. Latinum: 10.` };
    
    expect(BeamResourcesType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Sprungkosten (69307, Sovereign Refit) beamt in Sektor 45|16 Waren von Huasiurk (71828, AntaresB): Deuterium: 200. Sorium: 10. Latinum: 20." };
    const parseResult = BeamResourcesType.parse(testLogEntry.entry, testLogEntry.lang);

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
    expect(parseResult.ship.ncc).toBe(69307);
    expect(parseResult.ship.name).toBe("Sprungkosten");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Sovereign Refit");

    // beamTarget
    expect(parseResult.beamTarget.ncc).toBe(71828);
    expect(parseResult.beamTarget.name).toBe("Huasiurk");
    expect(parseResult.beamTarget.nccPrefix).toBeNull();
    expect(parseResult.beamTarget.shipClass).toBe("AntaresB");

    // sector
    expect(parseResult.sector.x).toBe(45);
    expect(parseResult.sector.y).toBe(16);

    // transport type
    expect(parseResult.transportType).toBe(BeamTransportType.beam);

    // beam direction
    expect(parseResult.beamDirection).toBe(BeamDirection.fromTarget);
    
    // no items
    expect(parseResult.items.length).toBe(0);

    // resources
    expect(parseResult.resources.length).toBe(3);
    const deuterium = parseResult.resources[0];
    const sorium = parseResult.resources[1];
    const latinum = parseResult.resources[2];

    expect(deuterium.resource).toBe(BeamResource.deuterium);
    expect(deuterium.amount).toBe(200);

    expect(sorium.resource).toBe(BeamResource.sorium);
    expect(sorium.amount).toBe(10);

    expect(latinum.resource).toBe(BeamResource.latinum);
    expect(latinum.amount).toBe(20);
    
  });

  test("parses unkown resource correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Sprungkosten (69307, Sovereign Refit) beamt in Sektor 45|16 Waren zu Huasiurk (71828, AntaresB): Steuererklärungen: 20." };
    const parseResult = BeamResourcesType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();

    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(69307);
    expect(parseResult.ship.name).toBe("Sprungkosten");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Sovereign Refit");

    // beamTarget
    expect(parseResult.beamTarget.ncc).toBe(71828);
    expect(parseResult.beamTarget.name).toBe("Huasiurk");
    expect(parseResult.beamTarget.nccPrefix).toBeNull();
    expect(parseResult.beamTarget.shipClass).toBe("AntaresB");

    // sector
    expect(parseResult.sector.x).toBe(45);
    expect(parseResult.sector.y).toBe(16);

    // transport type
    expect(parseResult.transportType).toBe(BeamTransportType.beam);

    // beam direction
    expect(parseResult.beamDirection).toBe(BeamDirection.toTarget);
    
    // no items
    expect(parseResult.items.length).toBe(0);

    // resources
    expect(parseResult.resources.length).toBe(1);
    const resource = parseResult.resources[0];

    expect(resource.resource).toBe(BeamResource.unknown);
    expect(resource.amount).toBe(20);
  });
})