import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import Statistics from '../../src/statistics/statistics.js';
import AvatarBoardingInterceptedType from '../../src/line-type/avatar-boarding-intercepted-type.js';

describe('avatar boarding intercepted line type', () => {
  const lineTypeClass = AvatarBoardingInterceptedType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionFailure]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Security (48131, Sicherheitsoffizier) von Zielscheibe (71848, Raumdock) beamt sich mit einem Außenteam an Bord von Buneock (52946, Iowa). Security 1 (48025, Sicherheitsoffizier) fängt die Eindringlinge mit einem eigenen Sicherheitsteam ab und startet ein wildes Feuergefecht!` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Security (48131, Sicherheitsoffizier) von Zielscheibe (71848, Raumdock) beamt sich mit einem Außenteam an Bord von Buneock (52946, Iowa). Security 1 (48025, Sicherheitsoffizier) fängt die Eindringlinge mit einem eigenen Sicherheitsteam ab und startet ein wildes Feuergefecht!" };
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

    // target
    expect(parseResult.target.ncc).toBe(52946);
    expect(parseResult.target.name).toBe("Buneock");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Iowa");

    // intercepting avatar
    expect(parseResult.interceptingAvatar.name).toBe("Security 1");
    expect(parseResult.interceptingAvatar.itemId).toBe(48025);
    expect(parseResult.interceptingAvatar.job).toBe(AvatarJob.securityOfficer);
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Security (48131, Sicherheitsoffizier) von Zielscheibe (71848, Raumdock) beamt sich mit einem Außenteam an Bord von Buneock (52946, Iowa). Security 1 (48025, Sicherheitsoffizier) fängt die Eindringlinge mit einem eigenen Sicherheitsteam ab und startet ein wildes Feuergefecht!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(71848);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(71848);
    expect(ship.name).toBe("Zielscheibe");
    const targetShip = statistics.ships.getShipByNcc(52946);
    expect(targetShip).not.toBeNull();
    expect(targetShip.ncc).toBe(52946);
    expect(targetShip.name).toBe("Buneock");
  });

  test("registers avatars in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Security (48131, Sicherheitsoffizier) von Zielscheibe (71848, Raumdock) beamt sich mit einem Außenteam an Bord von Buneock (52946, Iowa). Security 1 (48025, Sicherheitsoffizier) fängt die Eindringlinge mit einem eigenen Sicherheitsteam ab und startet ein wildes Feuergefecht!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.avatars.mentionedAvatars.length).toBe(2);
    const avatar = statistics.avatars.getAvatarByItemId(48131);
    expect(avatar).not.toBeNull();
    expect(avatar.itemId).toBe(48131);
    expect(avatar.name).toBe("Security");
    expect(avatar.job).toBe(AvatarJob.securityOfficer);

    // actions
    expect(avatar.totalActions).toBe(1);
    expect(avatar.successfulActions).toBe(0);

    const interceptingAvatar = statistics.avatars.getAvatarByItemId(48025);
    expect(interceptingAvatar).not.toBeNull();
    expect(interceptingAvatar.itemId).toBe(48025);
    expect(interceptingAvatar.name).toBe("Security 1");
    expect(interceptingAvatar.job).toBe(AvatarJob.securityOfficer);

    // actions
    expect(interceptingAvatar.totalActions).toBe(1);
    expect(interceptingAvatar.successfulActions).toBe(1);
  });
})