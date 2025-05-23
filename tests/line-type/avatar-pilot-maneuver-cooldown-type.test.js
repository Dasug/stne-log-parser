import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarPilotManeuverCooldownType from '../../src/line-type/avatar-pilot-maneuver-cooldown-type.js';

describe('avatar pilot maneuver cooldown line type', () => {
  test("has correct tags", () => {
    expect(AvatarPilotManeuverCooldownType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarActionFailure]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Annett Hirsch (1140807, Pilot) kann kein 2. Manöver, so kurz nach dem 1. durchführen. Er kann jetzt nichts tun um den Angriff gegen Vetro (2838280, Battle Carrier Wrack) zu verstärken!` };
    
    expect(AvatarPilotManeuverCooldownType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Annett Hirsch (1140807, Pilot) kann kein 2. Manöver, so kurz nach dem 1. durchführen. Er kann jetzt nichts tun um den Angriff gegen Vetro (2838280, Battle Carrier Wrack) zu verstärken!" };
    const parseResult = AvatarPilotManeuverCooldownType.parse(testLogEntry.entry, testLogEntry.lang);

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
})