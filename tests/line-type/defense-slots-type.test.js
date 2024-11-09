import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/line-type/tags/line-tag.js';
import DefenseSlotsType from '../../src/line-type/defense-slots-type.js';

describe('defense slots line type', () => {
  test("has battle and battle slots tag", () => {
    expect(DefenseSlotsType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.battleSlots]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "285,300000000001 Verteidigungskosten 88|38" };

    expect(DefenseSlotsType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": "0 Slots Defence Cost 639|290" };

    expect(DefenseSlotsType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`285,300000000001 Verteidigungskosten 88|38` }; // silly floating point shenanigans
    const parseResult = DefenseSlotsType.parse(testLogEntry.entry, testLogEntry.lang);

    expect(parseResult.slots).toBeCloseTo(285.3);

    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.sector.x).toBe(88);
    expect(parseResult.sector.y).toBe(38);
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`0 Slots Defence Cost 639|290` };
    const parseResult = DefenseSlotsType.parse(testLogEntry.entry, testLogEntry.lang);

    expect(parseResult.slots).toBeCloseTo(0);

    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.sector.x).toBe(639);
    expect(parseResult.sector.y).toBe(290);
  });
})