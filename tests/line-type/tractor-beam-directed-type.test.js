import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import TractorBeamDirectedType from '../../src/line-type/tractor-beam-directed-type.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import PlayerNameAndIdResult from '../../src/regex/parse-result/player-name-and-id-result.js';
import Statistics from '../../src/statistics/statistics.js';

describe('tractor beam struggle line type', () => {
  const lineTypeClass = TractorBeamDirectedType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.tractorBeam]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Traktorstrahl auf [Scout] Pibag (2882829, Sonde) von []U.C.W[] Scorga Empire (34108) gerichtet` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Traktorstrahl auf [Scout] Pibag (2882829, Sonde) von []U.C.W[] Scorga Empire (34108) gerichtet" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.target).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.targetOwner).not.toBeNull();
    expect(parseResult.targetOwner).toBeInstanceOf(PlayerNameAndIdResult);
    
    // parts are set correctly
    // target
    expect(parseResult.target.name).toBe("[Scout] Pibag");
    expect(parseResult.target.ncc).toBe(2882829);
    expect(parseResult.target.shipClass).toBe("Sonde");
    
    // targetOwner
    expect(parseResult.targetOwner.name).toBe("[]U.C.W[] Scorga Empire");
    expect(parseResult.targetOwner.idPrefix).toBeNull();
    expect(parseResult.targetOwner.id).toBe(34108);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Traktorstrahl auf [Scout] Pibag (2882829, Sonde) von []U.C.W[] Scorga Empire (34108) gerichtet` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2882829);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2882829);
    expect(ship.name).toBe("[Scout] Pibag");
  });

  test("registers player character in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Traktorstrahl auf [Scout] Pibag (2882829, Sonde) von []U.C.W[] Scorga Empire (34108) gerichtet` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.playerCharacters.mentionedPlayerCharacters.length).toBe(1);
    const playerCharacter = statistics.playerCharacters.getPlayerCharacterById(34108);
    expect(playerCharacter).not.toBeNull();
    expect(playerCharacter.id).toBe(34108);
    expect(playerCharacter.name).toBe("[]U.C.W[] Scorga Empire");
  });

  test("registers ship ownership in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Traktorstrahl auf [Scout] Pibag (2882829, Sonde) von []U.C.W[] Scorga Empire (34108) gerichtet` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    const ship = statistics.ships.getShipByNcc(2882829);
    const player = statistics.playerCharacters.getPlayerCharacterById(34108);
    expect(ship.owner).toBe(player);
    expect(player.ships).toContain(ship);
  });
})