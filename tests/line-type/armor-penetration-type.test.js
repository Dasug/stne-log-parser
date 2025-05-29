import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ArmorPenetrationType from '../../src/line-type/armor-penetration-type';

describe('armor penetration line type', () => {
  const lineTypeClass = ArmorPenetrationType;
  test("has battle tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`4 Panzerung durchdrungen.` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Penetrated 2 points of armor.` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`4 Panzerung durchdrungen.` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    expect(parseResult.armorPenetration).toBe(4);
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Penetrated 2 points of armor.` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    expect(parseResult.armorPenetration).toBe(2);
  });
})