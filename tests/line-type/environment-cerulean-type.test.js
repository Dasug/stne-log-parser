import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import EnvironmentCeruleanType from '../../src/line-type/environment-cerulean-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('environment cerulean line type', () => {
  const lineTypeClass = EnvironmentCeruleanType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.shipMovement, LineTag.environmentEffect]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`=MS= Echo Fatalis (2873452, Tamani) verliert 375 Energie durch die Einwirkung eines Cerulanischen Nebels!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  // this log line does not exist in game but in case they ever fix the typo this should still detect it
  test("detects German entry log line with fixed typo positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`[Scout] Itokaa (2881610, Sonde) verliert 1,25 Energie durch die Einwirkung eines Ceruleanischen Nebels!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "[Scout] Itokaa (2881610, Sonde) verliert 1,25 Energie durch die Einwirkung eines Cerulanischen Nebels!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.name).toBe("[Scout] Itokaa");
    expect(parseResult.ship.ncc).toBe(2881610);
    expect(parseResult.ship.shipClass).toBe("Sonde");
    
    // target
    expect(parseResult.energyLoss).toBeCloseTo(1.25);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`[Scout] Itokaa (2881610, Sonde) verliert 1,25 Energie durch die Einwirkung eines Ceruleanischen Nebels!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2881610);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2881610);
    expect(ship.name).toBe("[Scout] Itokaa");
  });
})