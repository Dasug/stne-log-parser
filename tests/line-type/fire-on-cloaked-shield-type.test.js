import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import FireOnCloakedShieldType from '../../src/line-type/fire-on-cloaked-shield-type.js';
import FireOnCloakedShieldResult from '../../src/line-type/parse-result/fire-on-cloaked-shield-result.js';

describe('fire on cloaked shield line type', () => {
  const lineTypeClass = FireOnCloakedShieldType;
  test("has battle tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.weaponShotResult]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Die Sensoren registrieren ein Energieschwankung, wie sie beim Beschuss von planetaren Schilden auftritt!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  
  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Die Sensoren registrieren ein Energieschwankung, wie sie beim Beschuss von planetaren Schilden auftritt!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are set correctly
    expect(parseResult).toBeInstanceOf(FireOnCloakedShieldResult);
  });
})
