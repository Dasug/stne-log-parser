import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarPilotManeuverFailureType from '../../src/line-type/avatar-pilot-maneuver-failure-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('avatar pilot maneuver failure line type', () => {
  const lineTypeClass = AvatarPilotManeuverFailureType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarActionFailure]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Vetro (2838280, Battle Carrier Wrack) kontert das Manöver von Annett Hirsch (1140807, Pilot) geschickt und schützt erfolgreich die verwundbaren Stellen!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Vetro (2838280, Battle Carrier Wrack) kontert das Manöver von Annett Hirsch (1140807, Pilot) geschickt und schützt erfolgreich die verwundbaren Stellen!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Annett Hirsch");
    expect(parseResult.avatar.itemId).toBe(1140807);
    expect(parseResult.avatar.job).toBe(AvatarJob.pilot);

    // target
    expect(parseResult.target.ncc).toBe(2838280);
    expect(parseResult.target.name).toBe("Vetro");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Battle Carrier Wrack");
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Vetro (2838280, Battle Carrier Wrack) kontert das Manöver von Annett Hirsch (1140807, Pilot) geschickt und schützt erfolgreich die verwundbaren Stellen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2838280);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2838280);
    expect(ship.name).toBe("Vetro");
  });

  test("registers avatar in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Vetro (2838280, Battle Carrier Wrack) kontert das Manöver von Annett Hirsch (1140807, Pilot) geschickt und schützt erfolgreich die verwundbaren Stellen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.avatars.mentionedAvatars.length).toBe(1);
    const avatar = statistics.avatars.getAvatarByItemId(1140807);
    expect(avatar).not.toBeNull();
    expect(avatar.itemId).toBe(1140807);
    expect(avatar.name).toBe("Annett Hirsch");
    expect(avatar.job).toBe(AvatarJob.pilot);

    // actions
    expect(avatar.totalActions).toBe(0);
    expect(avatar.successfulActions).toBe(0);
  });
})