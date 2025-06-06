import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ShotMissedType from '../../src/line-type/shot-missed-type';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import BuildingResult from '../../src/regex/parse-result/building-result.js';
import BuildingType from '../../src/enum/building-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('shot missed line type', () => {
  const lineTypeClass = ShotMissedType;
  test("has battle tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.weaponShotResult]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Ifuat (2837138, Verlassene Klaestron) verfehlt das Ziel!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Warrior OI8497 (1658087, LX710b) misses its target!` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Ifuat (2837138, Verlassene Klaestron) verfehlt das Ziel!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.origin).not.toBeNull();
    
    // parts are set correctly
    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(2837138);
    expect(parseResult.origin.name).toBe("Ifuat");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Verlassene Klaestron");
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Warrior OI8497 (1658087, LX710b) misses its target!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.station).not.toBeNull();
    
    // parts are set correctly
    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(1658087);
    expect(parseResult.origin.name).toBe("Warrior OI8497");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("LX710b");
  });

  test("parses German building log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Disruptorbatterie verfehlt das Ziel!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.origin).not.toBeNull();
    
    // parts are set correctly
    // origin
    expect(parseResult.origin).toBeInstanceOf(BuildingResult);
    expect(parseResult.origin.name).toBeNull();
    expect(parseResult.origin.type).toBe(BuildingType.disruptorBattery);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Ifuat (2837138, Verlassene Klaestron) verfehlt das Ziel!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2837138);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2837138);
    expect(ship.name).toBe("Ifuat");
  });
})