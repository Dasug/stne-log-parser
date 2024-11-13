import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarWeakPointMissType from '../../src/line-type/avatar-weak-point-miss-type.js';

describe('avatar weak point miss line type', () => {
  test("has correct tags", () => {
    expect(AvatarWeakPointMissType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionFailure]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Tim Becker (801516, Waffenoffizier) verfehlt die anvisierte Schwachstelle von Vetro (2838280, Battle Carrier Wrack)!` };
    
    expect(AvatarWeakPointMissType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Tim Becker (801516, Waffenoffizier) verfehlt die anvisierte Schwachstelle von Vetro (2838280, Battle Carrier Wrack)!" };
    const parseResult = AvatarWeakPointMissType.parse(testLogEntry.entry, testLogEntry.lang);

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
})