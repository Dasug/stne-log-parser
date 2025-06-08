import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarAttackDroneLaunchType from '../../src/line-type/avatar-attack-drone-launch-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('avatar attack drone launch line type', () => {
  const lineTypeClass = AvatarAttackDroneLaunchType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Petra Kappel (570216, Drohnenpilot) setzt eine Angriffsdrohne ein und stürzt sie auf Dikees (2826794, Verlassene Adrec)!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Petra Kappel (570216, Drohnenpilot) setzt eine Angriffsdrohne ein und stürzt sie auf Dikees (2826794, Verlassene Adrec)!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Petra Kappel");
    expect(parseResult.avatar.itemId).toBe(570216);
    expect(parseResult.avatar.job).toBe(AvatarJob.dronePilot);

    // target
    expect(parseResult.target.ncc).toBe(2826794);
    expect(parseResult.target.name).toBe("Dikees");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Verlassene Adrec");
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Petra Kappel (570216, Drohnenpilot) setzt eine Angriffsdrohne ein und stürzt sie auf Dikees (2826794, Verlassene Adrec)!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2826794);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2826794);
    expect(ship.name).toBe("Dikees");
  });

  test("registers avatar in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Petra Kappel (570216, Drohnenpilot) setzt eine Angriffsdrohne ein und stürzt sie auf Dikees (2826794, Verlassene Adrec)!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.avatars.mentionedAvatars.length).toBe(1);
    const avatar = statistics.avatars.getAvatarByItemId(570216);
    expect(avatar).not.toBeNull();
    expect(avatar.itemId).toBe(570216);
    expect(avatar.name).toBe("Petra Kappel");
    expect(avatar.job).toBe(AvatarJob.dronePilot);

    // actions
    expect(avatar.totalActions).toBe(1);
    expect(avatar.successfulActions).toBe(0);
  });
})