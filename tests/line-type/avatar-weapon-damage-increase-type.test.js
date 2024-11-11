import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarWeaponDamageIncreaseType from '../../src/line-type/avatar-weapon-damage-increase-type.js';

describe('avatar weapon damage increase line type', () => {
  test("has correct tags", () => {
    expect(AvatarWeaponDamageIncreaseType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionSuccess]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Commander Bravestorm (797593, Waffenoffizier) zielt auf ein kritisches Untersystem wodurch der Angriff von Stormlord (2235413, Imperiale Prometheus) gegen Pluvass (2840934, Verlassene Rhino) um 28% stärker ausfällt!` };
    
    expect(AvatarWeaponDamageIncreaseType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Commander Bravestorm (797593, Waffenoffizier) zielt auf ein kritisches Untersystem wodurch der Angriff von Stormlord (2235413, Imperiale Prometheus) gegen Pluvass (2840934, Verlassene Rhino) um 28% stärker ausfällt!" };
    const parseResult = AvatarWeaponDamageIncreaseType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Commander Bravestorm");
    expect(parseResult.avatar.itemId).toBe(797593);
    expect(parseResult.avatar.job).toBe(AvatarJob.weaponsOfficier);

    // ship
    expect(parseResult.ship.ncc).toBe(2235413);
    expect(parseResult.ship.name).toBe("Stormlord");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Imperiale Prometheus");

    // target
    expect(parseResult.target.ncc).toBe(2840934);
    expect(parseResult.target.name).toBe("Pluvass");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Verlassene Rhino");

    // alert level
    expect(parseResult.damageIncrease).toBe(28);
    
  });
})