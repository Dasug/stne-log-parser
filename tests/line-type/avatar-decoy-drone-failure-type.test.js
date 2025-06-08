import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarDecoyDroneFailureType from '../../src/line-type/avatar-decoy-drone-failure-type.js';
import ColonyNameAndIdResult from '../../src/regex/parse-result/colony-name-and-id-result.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import Statistics from '../../src/statistics/statistics.js';

describe('avatar decoy drone failure line type', () => {
  const lineTypeClass = AvatarDecoyDroneFailureType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionFailure]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Lukas Meyer (1492406, Drohnenpilot) setzt eine Köderdrohne ein, kann die Zielerfassung von Kluboc (2838279, Battle Carrier Wrack) beim Angriff auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) aber nicht täuschen!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Lukas Meyer (1492406, Drohnenpilot) setzt eine Köderdrohne ein, kann die Zielerfassung von Kluboc (2838279, Battle Carrier Wrack) beim Angriff auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) aber nicht täuschen!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.opponent).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
        
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Lukas Meyer");
    expect(parseResult.avatar.itemId).toBe(1492406);
    expect(parseResult.avatar.job).toBe(AvatarJob.dronePilot);

    // opponent
    expect(parseResult.opponent).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.opponent.ncc).toBe(2838279);
    expect(parseResult.opponent.name).toBe("Kluboc");
    expect(parseResult.opponent.nccPrefix).toBeNull();
    expect(parseResult.opponent.shipClass).toBe("Battle Carrier Wrack");

    // ship
    expect(parseResult.ship.ncc).toBe(2441662);
    expect(parseResult.ship.name).toBe("=MS= Panthera Nebulos");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Iowa Typ Z");
    
  });

  test("parses German log line against colony correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Jürgen Abendroth (1492415, Drohnenpilot) setzt eine Köderdrohne ein, kann die Zielerfassung von Asuras (85945) beim Angriff auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) aber nicht täuschen!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.opponent).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
        
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Jürgen Abendroth");
    expect(parseResult.avatar.itemId).toBe(1492415);
    expect(parseResult.avatar.job).toBe(AvatarJob.dronePilot);

    // opponent
    expect(parseResult.opponent).toBeInstanceOf(ColonyNameAndIdResult);
    expect(parseResult.opponent.name).toBe("Asuras");
    expect(parseResult.opponent.id).toBe(85945);

    // ship
    expect(parseResult.ship.ncc).toBe(2441662);
    expect(parseResult.ship.name).toBe("=MS= Panthera Nebulos");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Iowa Typ Z");
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Lukas Meyer (1492406, Drohnenpilot) setzt eine Köderdrohne ein, kann die Zielerfassung von Kluboc (2838279, Battle Carrier Wrack) beim Angriff auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) aber nicht täuschen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(2838279);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2838279);
    expect(ship.name).toBe("Kluboc");
    const ship2 = statistics.ships.getShipByNcc(2441662);
    expect(ship2).not.toBeNull();
    expect(ship2.ncc).toBe(2441662);
    expect(ship2.name).toBe("=MS= Panthera Nebulos");
  });

  test("registers colony in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Jürgen Abendroth (1492415, Drohnenpilot) setzt eine Köderdrohne ein, kann die Zielerfassung von Asuras (85945) beim Angriff auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) aber nicht täuschen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.colonies.mentionedColonies.length).toBe(1);
    const colony = statistics.colonies.getColonyById(85945);
    expect(colony).not.toBeNull();
    expect(colony.id).toBe(85945);
    expect(colony.name).toBe("Asuras");
  });

  test("registers avatar in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Jürgen Abendroth (1492415, Drohnenpilot) setzt eine Köderdrohne ein, kann die Zielerfassung von Asuras (85945) beim Angriff auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) aber nicht täuschen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.avatars.mentionedAvatars.length).toBe(1);
    const avatar = statistics.avatars.getAvatarByItemId(1492415);
    expect(avatar).not.toBeNull();
    expect(avatar.itemId).toBe(1492415);
    expect(avatar.name).toBe("Jürgen Abendroth");
    expect(avatar.job).toBe(AvatarJob.dronePilot);

    // actions
    expect(avatar.totalActions).toBe(1);
    expect(avatar.successfulActions).toBe(0);
  });
})