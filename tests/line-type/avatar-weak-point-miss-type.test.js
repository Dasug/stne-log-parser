import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarWeakPointMissType from '../../src/line-type/avatar-weak-point-miss-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('avatar weak point miss line type', () => {
  const lineTypeClass = AvatarWeakPointMissType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionFailure]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Tim Becker (801516, Waffenoffizier) verfehlt die anvisierte Schwachstelle von Vetro (2838280, Battle Carrier Wrack)!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Tim Becker (801516, Waffenoffizier) verfehlt die anvisierte Schwachstelle von Vetro (2838280, Battle Carrier Wrack)!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Tim Becker");
    expect(parseResult.avatar.itemId).toBe(801516);
    expect(parseResult.avatar.job).toBe(AvatarJob.weaponsOfficier);

    // target
    expect(parseResult.target.ncc).toBe(2838280);
    expect(parseResult.target.name).toBe("Vetro");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Battle Carrier Wrack");
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Tim Becker (801516, Waffenoffizier) verfehlt die anvisierte Schwachstelle von Vetro (2838280, Battle Carrier Wrack)!` };
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
    const testLogEntry = { "lang": "de", "entry": String.raw`Tim Becker (801516, Waffenoffizier) verfehlt die anvisierte Schwachstelle von Vetro (2838280, Battle Carrier Wrack)!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.avatars.mentionedAvatars.length).toBe(1);
    const avatar = statistics.avatars.getAvatarByItemId(801516);
    expect(avatar).not.toBeNull();
    expect(avatar.itemId).toBe(801516);
    expect(avatar.name).toBe("Tim Becker");
    expect(avatar.job).toBe(AvatarJob.weaponsOfficier);

    // actions
    expect(avatar.totalActions).toBe(1);
    expect(avatar.successfulActions).toBe(0);
  });
})