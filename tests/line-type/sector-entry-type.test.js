import { describe, expect, test } from '@jest/globals';
import SectorEntryType from '../../src/line-type/sector-entry-type';
import LineTag from '../../src/enum/line-tag.js';
import Statistics from '../../src/statistics/statistics.js';

describe('sector entry line type', () => {
  const lineTypeClass = SectorEntryType;
  test("has ship_movement tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.shipMovement]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Rohrfliege (2683217, Pegasus) von Systemlord Apophis (75604) ist in Sektor 123|456 eingeflogen" };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": "IMoovStufToo (1593773, Silverstar) von Loki (83929) has entered sector 999|999" };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Konrika [Friedensmission (2191321, Nova) von Ikonianer [NOK] (21335) ist in Sektor 345|215 eingeflogen` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2191321);
    expect(parseResult.ship.name).toBe("Konrika [Friedensmission");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Nova");
    
    // owner
    expect(parseResult.owner.id).toBe(21335);
    expect(parseResult.owner.name).toBe("Ikonianer [NOK]");
    expect(parseResult.owner.idPrefix).toBeNull();
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Colonisation ship (1589269, DY-500) von Loki (83929) has entered sector 111|222` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1589269);
    expect(parseResult.ship.name).toBe("Colonisation ship");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("DY-500");
    
    // owner
    expect(parseResult.owner.id).toBe(83929);
    expect(parseResult.owner.name).toBe("Loki");
    expect(parseResult.owner.idPrefix).toBeNull();
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Rohrfliege (2683217, Pegasus) von Systemlord Apophis (75604) ist in Sektor 123|456 eingeflogen` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2683217);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2683217);
    expect(ship.name).toBe("Rohrfliege");
  });

  test("registers player character in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Rohrfliege (2683217, Pegasus) von Systemlord Apophis (75604) ist in Sektor 123|456 eingeflogen` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.playerCharacters.mentionedPlayerCharacters.length).toBe(1);
    const playerCharacter = statistics.playerCharacters.getPlayerCharacterById(75604);
    expect(playerCharacter).not.toBeNull();
    expect(playerCharacter.id).toBe(75604);
    expect(playerCharacter.name).toBe("Systemlord Apophis");
  });

  test("registers ship ownership in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Rohrfliege (2683217, Pegasus) von Systemlord Apophis (75604) ist in Sektor 123|456 eingeflogen` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    const ship = statistics.ships.getShipByNcc(2683217);
    const player = statistics.playerCharacters.getPlayerCharacterById(75604);
    expect(ship.owner).toBe(player);
    expect(player.ships).toContain(ship);
  });
})