import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import DeclareWarType from '../../src/line-type/declare-war-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('declare war line type', () => {
  const lineTypeClass = DeclareWarType;
  test("has diplomacy tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.diplomacy]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Siedler S||Rene (72309) hat dir den Krieg erklärt." };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Siedler Bayerisches Imperium [SJV] (76856) hat dir den Krieg erklärt.` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.player).not.toBeNull();
    
    // parts are set correctly
    // player
    expect(parseResult.player.id).toBe(76856);
    expect(parseResult.player.name).toBe("Bayerisches Imperium [SJV]");
    expect(parseResult.player.idPrefix).toBeNull();
  });

  test("registers player character in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Siedler Bayerisches Imperium [SJV] (76856) hat dir den Krieg erklärt.` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.playerCharacters.mentionedPlayerCharacters.length).toBe(1);
    const playerCharacter = statistics.playerCharacters.getPlayerCharacterById(76856);
    expect(playerCharacter).not.toBeNull();
    expect(playerCharacter.id).toBe(76856);
    expect(playerCharacter.name).toBe("Bayerisches Imperium [SJV]");
  });
})