import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import SystemBlockadeState from '../../src/enum/system-blockade-state.js';
import SystemBlockadeCaughtType from '../../src/line-type/system-blockade-caught-type.js';

describe('system blockade caught line type', () => {
  test("has correct tags", () => {
    expect(SystemBlockadeCaughtType.getTags()).toEqual(expect.arrayContaining([LineTag.shipMovement, LineTag.systemBlockade]));
  });
  test("detects German log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Antrieb von [3] CNS Falexem (2666179, Kelvin) erhitzt, durch die Systemblockade, um 82,9!" };

    expect(SystemBlockadeCaughtType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Antrieb von [3] CNS Falexem (2666179, Kelvin) erhitzt, durch die Systemblockade, um 82,9!` };
    const parseResult = SystemBlockadeCaughtType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.flightRangeLoss).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2666179);
    expect(parseResult.ship.name).toBe("[3] CNS Falexem");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Kelvin");
    
    // flightRangeLoss
    expect(parseResult.flightRangeLoss).toBeCloseTo(82.9);
  });
})