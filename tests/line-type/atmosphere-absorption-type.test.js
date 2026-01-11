import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AtmosphereAbsorptionType from '../../src/line-type/atmosphere-absorption-type.js';

describe('atmosphere absorption line type', () => {
  const lineTypeClass = AtmosphereAbsorptionType;
  test("has battle tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.weaponShotResult]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Die Atmosphäre schwächt die Stärke der Phaser um 5.` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  
  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Die Atmosphäre schwächt die Stärke der Phaser um 5.` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are set correctly
    expect(parseResult.atmosphereAbsorption).toBe(5);
    expect(parseResult.weaponName).toBe("Phaser");
  });
})
