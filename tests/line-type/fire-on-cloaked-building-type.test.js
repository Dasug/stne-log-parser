import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import FireOnCloakedBuildingType from '../../src/line-type/fire-on-cloaked-building-type.js';

describe('fire on cloaked building line type', () => {
  const lineTypeClass = FireOnCloakedBuildingType;
  test("has battle tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.weaponShotResult]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Phaser feuert auf das Ziel mit einer Stärke von 19!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  
  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Phaser feuert auf das Ziel mit einer Stärke von 19!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are set correctly
    expect(parseResult.weaponStrength).toBe(19);
    expect(parseResult.weaponName).toBe("Phaser");
  });
})
