import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ItemWeaponOverloadType from '../../src/line-type/item-weapon-overload-type.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import Statistics from '../../src/statistics/statistics.js';

describe('item weapon overload type', () => {
  const lineTypeClass = ItemWeaponOverloadType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.item, LineTag.battle]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Waffenüberladung überlädt die Waffensysteme mit einem kurzen Energiestoß, wodurch sich die Angriffskraft gegen =MS= Echo Fatalis (2873452, Tamani) um 35% erhöht!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Waffenüberladung überlädt die Waffensysteme mit einem kurzen Energiestoß, wodurch sich die Angriffskraft gegen =MS= Echo Fatalis (2873452, Tamani) um 35% erhöht!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.target).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.damageIncrease).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.target.ncc).toBe(2873452);
    expect(parseResult.target.name).toBe("=MS= Echo Fatalis");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Tamani");
    
    // strength increase
    expect(parseResult.damageIncrease).toBeCloseTo(35);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Waffenüberladung überlädt die Waffensysteme mit einem kurzen Energiestoß, wodurch sich die Angriffskraft gegen =MS= Echo Fatalis (2873452, Tamani) um 35% erhöht!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2873452);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2873452);
    expect(ship.name).toBe("=MS= Echo Fatalis");
  });
})