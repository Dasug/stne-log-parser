import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarDecoyDroneSuccessType from '../../src/line-type/avatar-decoy-drone-success-type.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import ColonyNameAndIdResult from '../../src/regex/parse-result/colony-name-and-id-result.js';
import Statistics from '../../src/statistics/statistics.js';

describe('avatar decoy drone success line type', () => {
  const lineTypeClass = AvatarDecoyDroneSuccessType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionSuccess]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Frothu (2841749, Battle Carrier Wrack) trifft die Köderdrohne von Kerstin Zimmermann (1492409, Drohnenpilot) auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) mit Geistlanze und zerstört sie!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Frothu (2841749, Battle Carrier Wrack) trifft die Köderdrohne von Kerstin Zimmermann (1492409, Drohnenpilot) auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) mit Geistlanze und zerstört sie!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.opponent).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
        
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Kerstin Zimmermann");
    expect(parseResult.avatar.itemId).toBe(1492409);
    expect(parseResult.avatar.job).toBe(AvatarJob.dronePilot);

    // opponent
    expect(parseResult.opponent).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.opponent.ncc).toBe(2841749);
    expect(parseResult.opponent.name).toBe("Frothu");
    expect(parseResult.opponent.nccPrefix).toBeNull();
    expect(parseResult.opponent.shipClass).toBe("Battle Carrier Wrack");

    // ship
    expect(parseResult.ship.ncc).toBe(2441662);
    expect(parseResult.ship.name).toBe("=MS= Panthera Nebulos");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Iowa Typ Z");

    expect(parseResult.weaponName).toBe("Geistlanze");
    
  });

  test("parses German log line against colony correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Asuras (85945) trifft die Köderdrohne von Jürgen Abendroth (1492415, Drohnenpilot) auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) mit Phaser und zerstört sie!" };
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
    expect(parseResult.opponent.id).toBe(85945);
    expect(parseResult.opponent.name).toBe("Asuras");

    // ship
    expect(parseResult.ship.ncc).toBe(2441662);
    expect(parseResult.ship.name).toBe("=MS= Panthera Nebulos");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Iowa Typ Z");

    expect(parseResult.weaponName).toBe("Phaser");
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Frothu (2841749, Battle Carrier Wrack) trifft die Köderdrohne von Kerstin Zimmermann (1492409, Drohnenpilot) auf =MS= Panthera Nebulos (2441662, Iowa Typ Z) mit Geistlanze und zerstört sie!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(2839350);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2839350);
    expect(ship.name).toBe("Kofes");
    const targetShip = statistics.ships.getShipByNcc(2551448);
    expect(targetShip).not.toBeNull();
    expect(targetShip.ncc).toBe(2551448);
    expect(targetShip.name).toBe("Storm of Retribution");
  });
})