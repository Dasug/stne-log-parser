import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import HangarScrambleType from '../../src/line-type/hangar-scramble-type.js';

describe('hangar scramble line type', () => {
  test("has correct tags", () => {
    expect(HangarScrambleType.getTags()).toEqual(expect.arrayContaining([LineTag.hangar, LineTag.battle]));
  });
  test("detects German log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Graf-Zeppelin (2180645, Rei´Kon) löst in Sektor @79|539 Angriffsalarm im Hangarbereich aus!" };

    expect(HangarScrambleType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Graf-Zeppelin (2180645, Rei´Kon) löst in Sektor @79|539 Angriffsalarm im Hangarbereich aus!` };
    const parseResult = HangarScrambleType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2180645);
    expect(parseResult.ship.name).toBe("Graf-Zeppelin");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Rei´Kon");
    
    // sector
    expect(parseResult.sector.x).toBe(79);
    expect(parseResult.sector.y).toBe(539);
    expect(parseResult.sector.orbit).toBe(true);
  });
})