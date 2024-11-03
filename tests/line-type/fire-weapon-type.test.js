import { describe, expect, test } from '@jest/globals';
import FireWeaponType from '../../src/line-type/fire-weapon-type';

describe('fire weapon type line type', () => {
  test("has battle tag", () => {
    expect(FireWeaponType.getTags()).toEqual(expect.arrayContaining(["battle"]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Pegasus Hood (2360134, Pegasus) von Tanithisches Imperium (74379) greift Verlassene Adrec Pilli (2837151, Verlassene Adrec) mit Verteronphasenkanone und Stärke 76/72/0 an` };
    
    expect(FireWeaponType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Tamani [FIST] Unknown Classified (1500023, Tamani) from Dasug Nowagor {=BSC=} (24) attacks Vadwaur probe Probe 1663682 (1663682, Vadwaur probe) with Phaser, Strength 20/20/0` };

    expect(FireWeaponType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Pegasus Hood (2360134, Pegasus) von Tanithisches Imperium (74379) greift Verlassene Adrec Pilli (2837151, Verlassene Adrec) mit Verteronphasenkanone und Stärke 76/72/0 an" };
    const parseResult = FireWeaponType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.weaponStrength).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2360134);
    expect(parseResult.ship.name).toBe("Hood");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Pegasus");
    
    // ship
    expect(parseResult.target.ncc).toBe(2837151);
    expect(parseResult.target.name).toBe("Pilli");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Verlassene Adrec");

    expect(parseResult.weaponName).toBe("Verteronphasenkanone");

    // weapon strength
    expect(parseResult.weaponStrength.shieldDamage).toBe(76);
    expect(parseResult.weaponStrength.hullDamage).toBe(72);
    expect(parseResult.weaponStrength.energyDamage).toBe(0);
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Tamani [FIST] Unknown Classified (1500023, Tamani) from Dasug Nowagor {=BSC=} (24) attacks Vadwaur probe Probe 1663682 (1663682, Vadwaur probe) with Phaser, Strength 20/20/0` };
    const parseResult = FireWeaponType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.weaponStrength).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1500023);
    expect(parseResult.ship.name).toBe("[FIST] Unknown Classified");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Tamani");
    
    // ship
    expect(parseResult.target.ncc).toBe(1663682);
    expect(parseResult.target.name).toBe("Probe 1663682");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Vadwaur probe");

    expect(parseResult.weaponName).toBe("Phaser");

    // weapon strength
    expect(parseResult.weaponStrength.shieldDamage).toBe(20);
    expect(parseResult.weaponStrength.hullDamage).toBe(20);
    expect(parseResult.weaponStrength.energyDamage).toBe(0);
  });
})