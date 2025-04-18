import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import BuildingDamageType from '../../src/line-type/building-damage-type.js';
import BuildingType from '../../src/enum/building-type.js';

describe('building damage line type', () => {
  test("has correct tags", () => {
    expect(BuildingDamageType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.weaponShotResult]));
  });
  test("detects German log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Phaser beschädigt Disruptorbatterie bei Position 1|0 um 20 Schadenspunkte! Disruptorbatterie ist jetzt auf 220." };

    expect(BuildingDamageType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Phaser beschädigt Disruptorbatterie bei Position 1|0 um 20 Schadenspunkte! Disruptorbatterie ist jetzt auf 220.` };
    const parseResult = BuildingDamageType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.position).not.toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.building).not.toBeNull();
    expect(parseResult.hullDamage).not.toBeNull();
    expect(parseResult.remainingHullStrength).not.toBeNull();
    
    // parts are set correctly
    expect(parseResult.position.x).toBe(1);
    expect(parseResult.position.y).toBe(0);
    expect(parseResult.weaponName).toBe("Phaser");
    expect(parseResult.building.type).toBe(BuildingType.disruptorBattery);
    expect(parseResult.building.name).toBeNull();
    expect(parseResult.hullDamage).toBe(20);
    expect(parseResult.remainingHullStrength).toBe(220);
  });

  test("parses German log line with building name correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Quantentorpedo MK 2 beschädigt PewPew(Phaserkanone) bei Position 0|0 um 114 Schadenspunkte! PewPew(Phaserkanone) ist jetzt auf 27.` };
    const parseResult = BuildingDamageType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.position).not.toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.building).not.toBeNull();
    expect(parseResult.hullDamage).not.toBeNull();
    expect(parseResult.remainingHullStrength).not.toBeNull();
    
    // parts are set correctly
    expect(parseResult.position.x).toBe(0);
    expect(parseResult.position.y).toBe(0);
    expect(parseResult.weaponName).toBe("Quantentorpedo MK 2");
    expect(parseResult.building.type).toBe(BuildingType.phaserCannon);
    expect(parseResult.building.name).toBe("PewPew");
    expect(parseResult.hullDamage).toBe(114);
    expect(parseResult.remainingHullStrength).toBe(27);
  });
})