import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import BeamInterruptedType from '../../src/line-type/beam-interrupted-type.js';
import BeamInterruptedResult from '../../src/line-type/parse-result/beam-interrupted-result.js';

describe('beam interrupted line type', () => {
  test("has transport and redundant tag", () => {
    expect(BeamInterruptedType.getTags()).toEqual(expect.arrayContaining([LineTag.transport, LineTag.redundant]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Beam-Sequenz wurde gestört" };

    expect(BeamInterruptedType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Beam-Sequenz wurde gestört` };
    const parseResult = BeamInterruptedType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    expect(parseResult).toBeInstanceOf(BeamInterruptedResult);
  });
})