import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarOutOfBaitDronesType from '../../src/line-type/avatar-out-of-bait-drones-type.js';

describe('avatar outof bait drones line type', () => {
  test("has correct tags", () => {
    expect(AvatarOutOfBaitDronesType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionFailure]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Stefan Gottschalk (1163078, Drohnenpilot) hat keine Köderdrohnen mehr zur Verfügung und kann deshalb nichts für [I.R.W.] Praetor II (2666412, Praetor) tun um dem Angriff von Susco (2822078, Spektrales Portal) zu engehen!` };
    
    expect(AvatarOutOfBaitDronesType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Stefan Gottschalk (1163078, Drohnenpilot) hat keine Köderdrohnen mehr zur Verfügung und kann deshalb nichts für [I.R.W.] Praetor II (2666412, Praetor) tun um dem Angriff von Susco (2822078, Spektrales Portal) zu engehen!" };
    const parseResult = AvatarOutOfBaitDronesType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Stefan Gottschalk");
    expect(parseResult.avatar.itemId).toBe(1163078);
    expect(parseResult.avatar.job).toBe(AvatarJob.dronePilot);

    // ship
    expect(parseResult.ship.ncc).toBe(2822078);
    expect(parseResult.ship.name).toBe("Susco");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Spektrales Portal");

    // target
    expect(parseResult.target.ncc).toBe(2666412);
    expect(parseResult.target.name).toBe("[I.R.W.] Praetor II");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Praetor");
    
  });
})