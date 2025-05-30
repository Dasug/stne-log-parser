import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarOutOfDronesType from '../../src/line-type/avatar-out-of-drones-type.js';
import DronePilotDroneType from '../../src/enum/drone-pilot-drone-type.js';
import ColonyNameAndIdResult from '../../src/regex/parse-result/colony-name-and-id-result.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import Statistics from '../../src/statistics/statistics.js';

describe('avatar out of drones line type', () => {
  const lineTypeClass = AvatarOutOfDronesType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionFailure]));
  });
  test("detects German decoy drone entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Stefan Gottschalk (1163078, Drohnenpilot) hat keine Köderdrohnen mehr zur Verfügung und kann deshalb nichts für [I.R.W.] Praetor II (2666412, Praetor) tun um dem Angriff von Susco (2822078, Spektrales Portal) zu engehen!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German decoy drone entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Stefan Gottschalk (1163078, Drohnenpilot) hat keine Köderdrohnen mehr zur Verfügung und kann deshalb nichts für [I.R.W.] Praetor II (2666412, Praetor) tun um dem Angriff von Susco (2822078, Spektrales Portal) zu engehen!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.opponent).not.toBeNull();
    
    // parts are set correctly
    expect(parseResult.droneType).toBe(DronePilotDroneType.decoyDrone);

    // avatar
    expect(parseResult.avatar.name).toBe("Stefan Gottschalk");
    expect(parseResult.avatar.itemId).toBe(1163078);
    expect(parseResult.avatar.job).toBe(AvatarJob.dronePilot);

    // opponent
    expect(parseResult.opponent).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.opponent.ncc).toBe(2822078);
    expect(parseResult.opponent.name).toBe("Susco");
    expect(parseResult.opponent.nccPrefix).toBeNull();
    expect(parseResult.opponent.shipClass).toBe("Spektrales Portal");

    // ship
    expect(parseResult.ship.ncc).toBe(2666412);
    expect(parseResult.ship.name).toBe("[I.R.W.] Praetor II");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Praetor");
    
  });

  test("parses German decoy drone log line against colony correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Jürgen Abendroth (1492415, Drohnenpilot) hat keine Köderdrohnen mehr zur Verfügung und kann deshalb nichts für =MS= Panthera Nebulos (2441662, Iowa Typ Z) tun um dem Angriff von Asuras (85945) zu engehen!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.opponent).not.toBeNull();
    
    // parts are set correctly
    expect(parseResult.droneType).toBe(DronePilotDroneType.decoyDrone);

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
    
  });

  test("detects German attack drone entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Melanie Fenstermacher (1378997, Drohnenpilot) hat keine Angriffsdrohnen mehr zur Verfügung und kann deshalb nichts für Sidonia (1812900, Co'Rask) tun um den Angriff gegen Oonaowu (2841463, Verlassene Cloverfield) zu verstärken!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German attack drone entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Melanie Fenstermacher (1378997, Drohnenpilot) hat keine Angriffsdrohnen mehr zur Verfügung und kann deshalb nichts für Sidonia (1812900, Co'Rask) tun um den Angriff gegen Oonaowu (2841463, Verlassene Cloverfield) zu verstärken!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.opponent).not.toBeNull();
    
    // parts are set correctly
    expect(parseResult.droneType).toBe(DronePilotDroneType.attackDrone);

    // avatar
    expect(parseResult.avatar.name).toBe("Melanie Fenstermacher");
    expect(parseResult.avatar.itemId).toBe(1378997);
    expect(parseResult.avatar.job).toBe(AvatarJob.dronePilot);

    // opponent
    expect(parseResult.opponent).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.opponent.ncc).toBe(2841463);
    expect(parseResult.opponent.name).toBe("Oonaowu");
    expect(parseResult.opponent.nccPrefix).toBeNull();
    expect(parseResult.opponent.shipClass).toBe("Verlassene Cloverfield");

    // ship
    expect(parseResult.ship.ncc).toBe(1812900);
    expect(parseResult.ship.name).toBe("Sidonia");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Co'Rask");
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Stefan Gottschalk (1163078, Drohnenpilot) hat keine Köderdrohnen mehr zur Verfügung und kann deshalb nichts für [I.R.W.] Praetor II (2666412, Praetor) tun um dem Angriff von Susco (2822078, Spektrales Portal) zu engehen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(2666412);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2666412);
    expect(ship.name).toBe("[I.R.W.] Praetor II");
    const ship2 = statistics.ships.getShipByNcc(2822078);
    expect(ship2).not.toBeNull();
    expect(ship2.ncc).toBe(2822078);
    expect(ship2.name).toBe("Susco");
  });
})