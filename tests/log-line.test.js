import { beforeAll, describe, expect, test } from '@jest/globals';
import LogLine from '../src/log-line.js';
import FireWeaponType from '../src/line-type/fire-weapon-type.js';
import FireWeaponResult from '../src/line-type/parse-result/fire-weapon-result.js';

describe('log line', () => {
  beforeAll(() => {
    LogLine.overrideLogLineTypes([
      FireWeaponType,
    ]);
  });

  test("detects log line correctly", () => {
    const line = String.raw`Assertive Aikiweo (2178720, Assertive) von []U.C.W[] Dachsavar Assguard Incorporated (72714) schlägt Darinaya Drovek (2514812, Darinaya) mit Disruptor und Stärke 24/24/0 zurück`;
    const logLine = LogLine.parse(
      line,
      'de'
    );

    expect(logLine.detected).toBe(true);
    expect(logLine.language).toBe("de");
    expect(logLine.line).toBe(line);
    expect(logLine.lineParser).toBe(FireWeaponType);
    expect(logLine.tags).toStrictEqual(FireWeaponType.getTags());
    expect(logLine.parseResult).toBeInstanceOf(FireWeaponResult);
  });

  test("marks undetected line correctly", () => {
    const line = String.raw`Surely this isn't a valid log line!`;
    const logLine = LogLine.parse(
      line,
      'en'
    );

    expect(logLine.detected).toBe(false);
    expect(logLine.language).toBeNull();
    expect(logLine.line).toBe(line);
    expect(logLine.lineParser).toBeNull();
    expect(logLine.parseResult).toBeNull();
  });
});