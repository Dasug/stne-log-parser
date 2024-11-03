import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/line-type/tags/line-tag';
import ArmorPenetrationType from '../../src/line-type/armor-penetration-type';

describe('armor penetration line type', () => {
  test("has battle tag", () => {
    expect(ArmorPenetrationType.getTags()).toEqual(expect.arrayContaining([LineTag.battle]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`4 Panzerung durchdrungen.` };
    
    expect(ArmorPenetrationType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Penetrated 2 points of armor.` };

    expect(ArmorPenetrationType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`4 Panzerung durchdrungen.` };
    const parseResult = ArmorPenetrationType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    expect(parseResult.armorPenetration).toBe(4);
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Penetrated 2 points of armor.` };
    const parseResult = ArmorPenetrationType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    expect(parseResult.armorPenetration).toBe(2);
  });
})