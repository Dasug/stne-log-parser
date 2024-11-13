import { describe, expect, test } from '@jest/globals';
import FireWeaponType from '../../src/line-type/fire-weapon-type';
import LineTag from '../../src/enum/line-tag.js';

describe('fire weapon type line type', () => {
  test("has battle tag", () => {
    expect(FireWeaponType.getTags()).toEqual(expect.arrayContaining([LineTag.battle]));
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
    expect(parseResult.isOffensive).toBe(true);
    expect(parseResult.isDefensive).toBe(false);

    // weapon strength
    expect(parseResult.weaponStrength.shieldDamage).toBe(76);
    expect(parseResult.weaponStrength.hullDamage).toBe(72);
    expect(parseResult.weaponStrength.energyDamage).toBe(0);
    
  });


  test("parses defensive German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Vor'Cha Sverð (2353095, Vor'Cha) von ]=SLC=[ Halgar von Tronje --Sky-Vicings - (65330) schlägt Korolev U.S.S. Dracaix (2819313, Korolev) mit klingonischer Disruptor Typ chorgh und Stärke 84/94/0 zurück" };
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
    expect(parseResult.ship.ncc).toBe(2353095);
    expect(parseResult.ship.name).toBe("Sverð");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Vor'Cha");
    
    // ship
    expect(parseResult.target.ncc).toBe(2819313);
    expect(parseResult.target.name).toBe("U.S.S. Dracaix");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Korolev");

    expect(parseResult.weaponName).toBe("klingonischer Disruptor Typ chorgh");
    expect(parseResult.isOffensive).toBe(false);
    expect(parseResult.isDefensive).toBe(true);

    // weapon strength
    expect(parseResult.weaponStrength.shieldDamage).toBe(84);
    expect(parseResult.weaponStrength.hullDamage).toBe(94);
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
    expect(parseResult.isOffensive).toBe(true);
    expect(parseResult.isDefensive).toBe(false);

    // weapon strength
    expect(parseResult.weaponStrength.shieldDamage).toBe(20);
    expect(parseResult.weaponStrength.hullDamage).toBe(20);
    expect(parseResult.weaponStrength.energyDamage).toBe(0);
  });

  test("parses somewhat old defensive English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Klaestron =s0x=SaLaMaNDeR 55 (1395455, Klaestron) of CoRMaC (76135) retaliates Adeos =TDS= J - 361 (1488361, Adeos) with Plasma Torpedo, Strength 24/24/0` };
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
    expect(parseResult.ship.ncc).toBe(1395455);
    expect(parseResult.ship.name).toBe("=s0x=SaLaMaNDeR 55");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Klaestron");
    
    // target
    expect(parseResult.target.ncc).toBe(1488361);
    expect(parseResult.target.name).toBe("=TDS= J - 361");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Adeos");

    expect(parseResult.weaponName).toBe("Plasma Torpedo");
    expect(parseResult.isOffensive).toBe(false);
    expect(parseResult.isDefensive).toBe(true);

    // weapon strength
    expect(parseResult.weaponStrength.shieldDamage).toBe(24);
    expect(parseResult.weaponStrength.hullDamage).toBe(24);
    expect(parseResult.weaponStrength.energyDamage).toBe(0);
    
  });

  test("detects somewhat broken German entry log line positively (Dahel)", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Verlassener Außenposten Egriuvu (2841450, Verlassener Außenposten) von Die Verdammten (NPC-76936) schlägt Dahel Strafe Poseidons 29 (2658963, Dahel) mit Kürbiskern und Stärke 8/0/16 ` };
    
    expect(FireWeaponType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Verlassener Außenposten Egriuvu (2841450, Verlassener Außenposten) von Die Verdammten (NPC-76936) schlägt Dahel Strafe Poseidons 29 (2658963, Dahel) mit Kürbiskern und Stärke 8/0/16 " };
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
    expect(parseResult.ship.ncc).toBe(2841450);
    expect(parseResult.ship.name).toBe("Egriuvu");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Verlassener Außenposten");
    
    // ship
    expect(parseResult.target.ncc).toBe(2658963);
    expect(parseResult.target.name).toBe("Strafe Poseidons 29");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Dahel");

    expect(parseResult.weaponName).toBe("Kürbiskern");
    expect(parseResult.isOffensive).toBe(false);
    expect(parseResult.isDefensive).toBe(true);

    // weapon strength
    expect(parseResult.weaponStrength.shieldDamage).toBe(8);
    expect(parseResult.weaponStrength.hullDamage).toBe(0);
    expect(parseResult.weaponStrength.energyDamage).toBe(16);
    
  });

})