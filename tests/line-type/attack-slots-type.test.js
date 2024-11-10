import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AttackSlotsType from '../../src/line-type/attack-slots-type.js';

describe('attack slots line type', () => {
  test("has battle and battle slots tag", () => {
    expect(AttackSlotsType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.battleSlots]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "23,92 Angriffskosten" };

    expect(AttackSlotsType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": "7,2 Slots Attack Cost" };

    expect(AttackSlotsType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`23,92 Angriffskosten` };
    const parseResult = AttackSlotsType.parse(testLogEntry.entry, testLogEntry.lang);

    expect(parseResult.slots).toBeCloseTo(23.92);
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`7,2 Slots Attack Cost` };
    const parseResult = AttackSlotsType.parse(testLogEntry.entry, testLogEntry.lang);

    expect(parseResult.slots).toBeCloseTo(7.2);
  });
})