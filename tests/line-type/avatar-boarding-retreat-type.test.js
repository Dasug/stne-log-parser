import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import Statistics from '../../src/statistics/statistics.js';
import AvatarBoardingRetreatType from '../../src/line-type/avatar-boarding-retreat-type.js';

describe('avatar boarding retreat line type', () => {
  const lineTypeClass = AvatarBoardingRetreatType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionFailure, LineTag.redundant]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Security (48131, Sicherheitsoffizier) sieht keine Chance mehr seinen Auftrag zu erfüllen und beamt sich zurück zu Zielscheibe (71848, Raumdock)!` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Security (48131, Sicherheitsoffizier) sieht keine Chance mehr seinen Auftrag zu erfüllen und beamt sich zurück zu Zielscheibe (71848, Raumdock)!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Security");
    expect(parseResult.avatar.itemId).toBe(48131);
    expect(parseResult.avatar.job).toBe(AvatarJob.securityOfficer);

    // ship
    expect(parseResult.ship.ncc).toBe(71848);
    expect(parseResult.ship.name).toBe("Zielscheibe");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Raumdock");
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Security (48131, Sicherheitsoffizier) sieht keine Chance mehr seinen Auftrag zu erfüllen und beamt sich zurück zu Zielscheibe (71848, Raumdock)!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(71848);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(71848);
    expect(ship.name).toBe("Zielscheibe");
  });

  test("registers avatar in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Security (48131, Sicherheitsoffizier) sieht keine Chance mehr seinen Auftrag zu erfüllen und beamt sich zurück zu Zielscheibe (71848, Raumdock)!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.avatars.mentionedAvatars.length).toBe(1);
    const avatar = statistics.avatars.getAvatarByItemId(48131);
    expect(avatar).not.toBeNull();
    expect(avatar.itemId).toBe(48131);
    expect(avatar.name).toBe("Security");
    expect(avatar.job).toBe(AvatarJob.securityOfficer);

    // actions
    expect(avatar.totalActions).toBe(0);
    expect(avatar.successfulActions).toBe(0);
  });
})