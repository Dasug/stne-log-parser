import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ItemWeaponOverloadType from '../../src/line-type/item-weapon-overload-type.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';

describe('item weapon overload type', () => {
  test("has correct tags", () => {
    expect(ItemWeaponOverloadType.getTags()).toEqual(expect.arrayContaining([LineTag.item, LineTag.battle]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Waffenüberladung überlädt die Waffensysteme mit einem kurzen Energiestoß, wodurch sich die Angriffskraft gegen =MS= Echo Fatalis (2873452, Tamani) um 35% erhöht!` };
    
    expect(ItemWeaponOverloadType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Waffenüberladung überlädt die Waffensysteme mit einem kurzen Energiestoß, wodurch sich die Angriffskraft gegen =MS= Echo Fatalis (2873452, Tamani) um 35% erhöht!" };
    const parseResult = ItemWeaponOverloadType.parse(testLogEntry.entry, testLogEntry.lang);

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
})