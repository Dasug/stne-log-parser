import { describe, expect, test } from '@jest/globals';
import PortalJumpType from '../../src/line-type/portal-jump-type.js';
import LineTag from '../../src/enum/line-tag.js';
import SalvageType from '../../src/line-type/salvage-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('portal jump line type', () => {
  const lineTypeClass = SalvageType;
  test("has ship_movement tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.economy]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Es wurden 288 Waren von Gilgamesh II :::: (zerstört) (2513106, Trümmerfeld) für 65,5 Energie extrahiert!" };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Es wurden 288 Waren von Gilgamesh II :::: (zerstört) (2513106, Trümmerfeld) für 65,5 Energie extrahiert!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.debrisField).not.toBeNull();
    
    // parts are set correctly
    // debris field
    expect(parseResult.debrisField.ncc).toBe(2513106);
    expect(parseResult.debrisField.name).toBe("Gilgamesh II :::: (zerstört)");
    expect(parseResult.debrisField.shipClass).toBe("Trümmerfeld");
    
    expect(parseResult.resourcesExtracted).toBe(288);
    expect(parseResult.energyUsed).toBeCloseTo(65.5);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Es wurden 288 Waren von Gilgamesh II :::: (zerstört) (2513106, Trümmerfeld) für 65,5 Energie extrahiert!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2513106);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2513106);
    expect(ship.name).toBe("Gilgamesh II :::: (zerstört)");
  });
})