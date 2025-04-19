import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarDecoyDroneFailureType from '../../src/line-type/avatar-decoy-drone-failure-type.js';
import ColonyNameAndIdResult from '../../src/regex/parse-result/colony-name-and-id-result.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';

describe('avatar decoy drone failure line type', () => {
  test("has correct tags", () => {
    expect(AvatarDecoyDroneFailureType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionFailure]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Lukas Meyer (1492406, Drohnenpilot) setzt eine Köderdrohne ein, kann die Zielerfassung von Kluboc (2838279, Battle Carrier Wrack) beim Angriff auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) aber nicht täuschen!` };
    
    expect(AvatarDecoyDroneFailureType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Lukas Meyer (1492406, Drohnenpilot) setzt eine Köderdrohne ein, kann die Zielerfassung von Kluboc (2838279, Battle Carrier Wrack) beim Angriff auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) aber nicht täuschen!" };
    const parseResult = AvatarDecoyDroneFailureType.parse(testLogEntry.entry, testLogEntry.lang);

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
    const parseResult = AvatarDecoyDroneFailureType.parse(testLogEntry.entry, testLogEntry.lang);

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
})