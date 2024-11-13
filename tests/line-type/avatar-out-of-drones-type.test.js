import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarOutOfDronesType from '../../src/line-type/avatar-out-of-drones-type.js';
import DronePilotDroneType from '../../src/enum/drone-pilot-drone-type.js';

describe('avatar out of drones line type', () => {
  test("has correct tags", () => {
    expect(AvatarOutOfDronesType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionFailure]));
  });
  test("detects German decoy drone entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Stefan Gottschalk (1163078, Drohnenpilot) hat keine Köderdrohnen mehr zur Verfügung und kann deshalb nichts für [I.R.W.] Praetor II (2666412, Praetor) tun um dem Angriff von Susco (2822078, Spektrales Portal) zu engehen!` };
    
    expect(AvatarOutOfDronesType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German decoy drone entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Stefan Gottschalk (1163078, Drohnenpilot) hat keine Köderdrohnen mehr zur Verfügung und kann deshalb nichts für [I.R.W.] Praetor II (2666412, Praetor) tun um dem Angriff von Susco (2822078, Spektrales Portal) zu engehen!" };
    const parseResult = AvatarOutOfDronesType.parse(testLogEntry.entry, testLogEntry.lang);

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

  test("detects German attack drone entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Melanie Fenstermacher (1378997, Drohnenpilot) hat keine Angriffsdrohnen mehr zur Verfügung und kann deshalb nichts für Sidonia (1812900, Co'Rask) tun um den Angriff gegen Oonaowu (2841463, Verlassene Cloverfield) zu verstärken!` };
    
    expect(AvatarOutOfDronesType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German attack drone entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Melanie Fenstermacher (1378997, Drohnenpilot) hat keine Angriffsdrohnen mehr zur Verfügung und kann deshalb nichts für Sidonia (1812900, Co'Rask) tun um den Angriff gegen Oonaowu (2841463, Verlassene Cloverfield) zu verstärken!" };
    const parseResult = AvatarOutOfDronesType.parse(testLogEntry.entry, testLogEntry.lang);

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
})