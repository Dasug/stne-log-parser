import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import BuildingArmorAbsorptionType from '../../src/line-type/building-armor-absorption-type.js';

describe('building armor absorption line type', () => {
  test("has correct tags", () => {
    expect(BuildingArmorAbsorptionType.getTags()).toEqual(expect.arrayContaining([LineTag.battle]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Die Panzerung des Gebäudes an Position 0|0 schwächt die Stärke der Phaser Typ 12 um 6 auf 73 Punkte ab." };

    expect(BuildingArmorAbsorptionType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Die Panzerung des Gebäudes an Position 12|1 schwächt die Stärke der Quantentorpedo MK 2 um 6 auf 114 Punkte ab.` };
    const parseResult = BuildingArmorAbsorptionType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.position).not.toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.armorAbsorption).not.toBeNull();
    expect(parseResult.weaponStrengthRemaining).not.toBeNull();
    
    // parts are set correctly
    expect(parseResult.position.x).toBe(12);
    expect(parseResult.position.y).toBe(1);
    expect(parseResult.weaponName).toBe("Quantentorpedo MK 2");
    expect(parseResult.armorAbsorption).toBe(6);
    expect(parseResult.weaponStrengthRemaining).toBe(114);
  });
})