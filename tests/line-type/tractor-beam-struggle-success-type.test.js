import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import TractorBeamStruggleSuccessType from '../../src/line-type/tractor-beam-struggle-success-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('tractor beam struggle line type', () => {
  const lineTypeClass = TractorBeamStruggleSuccessType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.tractorBeam]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`[Scout] Deudi konnte sich vom Traktorstrahl losreißen.` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "[Scout] Deudi konnte sich vom Traktorstrahl losreißen." };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.target).toBeInstanceOf(ShipNameOnlyResult);
    
    // parts are set correctly
    // target
    expect(parseResult.target.name).toBe("[Scout] Deudi");
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`[Scout] Deudi konnte sich vom Traktorstrahl losreißen.` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByName("[Scout] Deudi");
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBeNull();
    expect(ship.name).toBe("[Scout] Deudi");
  });
})