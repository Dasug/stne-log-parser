import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarBoardingEpsDamageType from '../../src/line-type/avatar-boarding-eps-damage-type.js';

describe('avatar boarding EPS damage line type', () => {
  test("has correct tags", () => {
    expect(AvatarBoardingEpsDamageType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionSuccess]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Anke Meyer (365906, Sicherheitsoffizier) von SMS Friedrich der Große (1713491, Cellship) beamt sich mit einem Außenteam an Bord von Slemiagh (2838115, Battlecruiser Wrack). Dort zerstören sie wahlos EPS-Relais und verursachen 211 direkten Energieverlust, 211 für Eindämmungsaufgaben und 106 Hüllenschaden.` };
    
    expect(AvatarBoardingEpsDamageType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Anke Meyer (365906, Sicherheitsoffizier) von SMS Friedrich der Große (1713491, Cellship) beamt sich mit einem Außenteam an Bord von Slemiagh (2838115, Battlecruiser Wrack). Dort zerstören sie wahlos EPS-Relais und verursachen 211 direkten Energieverlust, 211 für Eindämmungsaufgaben und 106 Hüllenschaden." };
    const parseResult = AvatarBoardingEpsDamageType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Anke Meyer");
    expect(parseResult.avatar.itemId).toBe(365906);
    expect(parseResult.avatar.job).toBe(AvatarJob.securityOfficer);

    // ship
    expect(parseResult.ship.ncc).toBe(1713491);
    expect(parseResult.ship.name).toBe("SMS Friedrich der Große");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Cellship");

    // target
    expect(parseResult.target.ncc).toBe(2838115);
    expect(parseResult.target.name).toBe("Slemiagh");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Battlecruiser Wrack");

    // alert level
    expect(parseResult.directEnergyDamage).toBe(211);
    expect(parseResult.countermeasuresEnergyDamage).toBe(211);
    expect(parseResult.hullDamage).toBe(106);
    
  });
})