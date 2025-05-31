import { describe, expect, test } from '@jest/globals';
import ActivateOverdriveType from '../../src/line-type/activate-overdrive-type.js';
import LineTag from '../../src/enum/line-tag.js';
import Statistics from '../../src/statistics/statistics.js';

describe('activate overdrive line type', () => {
  const lineTypeClass = ActivateOverdriveType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.shipMaintenance]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`[CV] Jäger 24 (2817833, Klaestron) von Bayerisches Imperium [SJV] (76856) aktiviert den Overdrive und kann nun, trotz überhitzter Triebwerke, weiterfliegen!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Colonisation ship (1497763, DY-500) activates its overdrive and can now, in spite of its overheated engines, continue flight!` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "[CV] Jäger 24 (2817833, Klaestron) von Bayerisches Imperium [SJV] (76856) aktiviert den Overdrive und kann nun, trotz überhitzter Triebwerke, weiterfliegen!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // owner
    expect(parseResult.owner.id).toBe(76856);
    expect(parseResult.owner.name).toBe("Bayerisches Imperium [SJV]");
    // ship
    expect(parseResult.ship.ncc).toBe(2817833);
    expect(parseResult.ship.name).toBe("[CV] Jäger 24");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Klaestron");
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Colonisation ship (1497763, DY-500) activates its overdrive and can now, in spite of its overheated engines, continue flight!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1497763);
    expect(parseResult.ship.name).toBe("Colonisation ship");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("DY-500");
  });

  test("registers ship in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`[CV] Jäger 24 (2817833, Klaestron) von Bayerisches Imperium [SJV] (76856) aktiviert den Overdrive und kann nun, trotz überhitzter Triebwerke, weiterfliegen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2817833);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2817833);
    expect(ship.name).toBe("[CV] Jäger 24");
  });

  test("registers player character in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`[CV] Jäger 24 (2817833, Klaestron) von Bayerisches Imperium [SJV] (76856) aktiviert den Overdrive und kann nun, trotz überhitzter Triebwerke, weiterfliegen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.playerCharacters.mentionedPlayerCharacters.length).toBe(1);
    const playerCharacter = statistics.playerCharacters.getPlayerCharacterById(76856);
    expect(playerCharacter).not.toBeNull();
    expect(playerCharacter.id).toBe(76856);
    expect(playerCharacter.name).toBe("Bayerisches Imperium [SJV]");
  });

  test("registers ship ownership in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`[CV] Jäger 24 (2817833, Klaestron) von Bayerisches Imperium [SJV] (76856) aktiviert den Overdrive und kann nun, trotz überhitzter Triebwerke, weiterfliegen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    const ship = statistics.ships.getShipByNcc(2817833);
    const player = statistics.playerCharacters.getPlayerCharacterById(76856);
    expect(ship.owner).toBe(player);
    expect(player.ships).toContain(ship);
  });
})