import { describe, expect, test } from '@jest/globals';
import ChargeWarpcoreType from '../../src/line-type/charge-warpcore-type';
import LineTag from '../../src/enum/line-tag.js';
import Statistics from '../../src/statistics/statistics.js';

describe('charge warpcore line type', () => {
  const lineTypeClass = ChargeWarpcoreType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.shipMaintenance]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Juscag* (2583692, Vertiga) von Ikonianer [NOK] (21335) hat den Warpkern um 100 auf 9701,56 aufgeladen` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Oheob (1577125, Pal Volra Refit) has charged its warp core by 1876 up to 6481.17` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Juscag* (2583692, Vertiga) von Ikonianer [NOK] (21335) hat den Warpkern um 100 auf 9701,56 aufgeladen" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // owner
    expect(parseResult.owner.id).toBe(21335);
    expect(parseResult.owner.name).toBe("Ikonianer [NOK]");
    // ship
    expect(parseResult.ship.ncc).toBe(2583692);
    expect(parseResult.ship.name).toBe("Juscag*");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Vertiga");
    
    expect(parseResult.chargeAmount).toBeCloseTo(100);
    expect(parseResult.warpcoreState).toBeCloseTo(9701.56);
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Oheob (1577125, Pal Volra Refit) has charged its warp core by 1876 up to 6481.17` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1577125);
    expect(parseResult.ship.name).toBe("Oheob");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Pal Volra Refit");
    
    expect(parseResult.chargeAmount).toBeCloseTo(1876);
    expect(parseResult.warpcoreState).toBeCloseTo(6481.17);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Juscag* (2583692, Vertiga) von Ikonianer [NOK] (21335) hat den Warpkern um 100 auf 9701,56 aufgeladen` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2583692);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2583692);
    expect(ship.name).toBe("Juscag*");
  });

  test("registers player character in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Juscag* (2583692, Vertiga) von Ikonianer [NOK] (21335) hat den Warpkern um 100 auf 9701,56 aufgeladen` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.playerCharacters.mentionedPlayerCharacters.length).toBe(1);
    const playerCharacter = statistics.playerCharacters.getPlayerCharacterById(21335);
    expect(playerCharacter).not.toBeNull();
    expect(playerCharacter.id).toBe(21335);
    expect(playerCharacter.name).toBe("Ikonianer [NOK]");
  });
})