import { describe, expect, test } from '@jest/globals';
import DeactivateShieldsType from '../../src/line-type/deactivate-shields-type';
import LineTag from '../../src/enum/line-tag.js';
import Statistics from '../../src/statistics/statistics.js';

describe('deactivate shields line type', () => {
  const lineTypeClass = DeactivateShieldsType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`[IRV] Odysseus (2509111, Hurricane) von Tal’Shiar (75203) deaktiviert die Schilde` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`TRES Sarajevo (1577151, Crossfield) von ROBYN BANKS Mad Tyrant of {=BSC=} (72133) deactivates the shields` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "[IRV] Odysseus (2509111, Hurricane) von Tal’Shiar (75203) deaktiviert die Schilde" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // owner
    expect(parseResult.owner.id).toBe(75203);
    expect(parseResult.owner.name).toBe("Tal’Shiar");
    // ship
    expect(parseResult.ship.ncc).toBe(2509111);
    expect(parseResult.ship.name).toBe("[IRV] Odysseus");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Hurricane");
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`TRES Sarajevo (1577151, Crossfield) von ROBYN BANKS Mad Tyrant of {=BSC=} (72133) deactivates the shields` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // owner
    expect(parseResult.owner.id).toBe(72133);
    expect(parseResult.owner.name).toBe("ROBYN BANKS Mad Tyrant of {=BSC=}");
    // ship
    expect(parseResult.ship.ncc).toBe(1577151);
    expect(parseResult.ship.name).toBe("TRES Sarajevo");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Crossfield");
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`[IRV] Odysseus (2509111, Hurricane) von Tal’Shiar (75203) deaktiviert die Schilde` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2509111);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2509111);
    expect(ship.name).toBe("[IRV] Odysseus");
  });

  test("registers player character in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`[IRV] Odysseus (2509111, Hurricane) von Tal’Shiar (75203) deaktiviert die Schilde` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.playerCharacters.mentionedPlayerCharacters.length).toBe(1);
    const playerCharacter = statistics.playerCharacters.getPlayerCharacterById(75203);
    expect(playerCharacter).not.toBeNull();
    expect(playerCharacter.id).toBe(75203);
    expect(playerCharacter.name).toBe("Tal’Shiar");
  });
})