import { describe, expect, test } from '@jest/globals';
import FireWeaponType from '../../src/line-type/fire-weapon-type';
import LineTag from '../../src/enum/line-tag.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import BuildingResult from '../../src/regex/parse-result/building-result.js';
import BuildingType from '../../src/enum/building-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('fire weapon type line type', () => {
  const lineTypeClass = FireWeaponType;
  test("has battle tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Pegasus Hood (2360134, Pegasus) von Tanithisches Imperium (74379) greift Verlassene Adrec Pilli (2837151, Verlassene Adrec) mit Verteronphasenkanone und Stärke 76/72/0 an` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Tamani [FIST] Unknown Classified (1500023, Tamani) from Dasug Nowagor {=BSC=} (24) attacks Vadwaur probe Probe 1663682 (1663682, Vadwaur probe) with Phaser, Strength 20/20/0` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Pegasus Hood (2360134, Pegasus) von Tanithisches Imperium (74379) greift Verlassene Adrec Pilli (2837151, Verlassene Adrec) mit Verteronphasenkanone und Stärke 76/72/0 an" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.weaponStrength).not.toBeNull();

    expect(parseResult.targetIsColony).toBe(false);
    expect(parseResult.originIsColony).toBe(false);
    
    // parts are set correctly
    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(2360134);
    expect(parseResult.origin.name).toBe("Hood");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Pegasus");
    
    // target
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
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.weaponStrength).not.toBeNull();

    expect(parseResult.targetIsColony).toBe(false);
    expect(parseResult.originIsColony).toBe(false);
    
    // parts are set correctly
    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(2353095);
    expect(parseResult.origin.name).toBe("Sverð");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Vor'Cha");
    
    // target
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
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.weaponStrength).not.toBeNull();

    expect(parseResult.targetIsColony).toBe(false);
    expect(parseResult.originIsColony).toBe(false);
    
    // parts are set correctly
    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(1500023);
    expect(parseResult.origin.name).toBe("[FIST] Unknown Classified");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Tamani");
    
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
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.weaponStrength).not.toBeNull();

    expect(parseResult.targetIsColony).toBe(false);
    expect(parseResult.originIsColony).toBe(false);
    
    // parts are set correctly
    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(1395455);
    expect(parseResult.origin.name).toBe("=s0x=SaLaMaNDeR 55");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Klaestron");
    
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
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses somewhat broken German entry log line correctly (Dahel)", () => {
    const testLogEntry = { "lang": "de", "entry": "Verlassener Außenposten Egriuvu (2841450, Verlassener Außenposten) von Die Verdammten (NPC-76936) schlägt Dahel Strafe Poseidons 29 (2658963, Dahel) mit Kürbiskern und Stärke 8/0/16 " };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.weaponStrength).not.toBeNull();

    expect(parseResult.targetIsColony).toBe(false);
    expect(parseResult.originIsColony).toBe(false);
    
    // parts are set correctly
    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(2841450);
    expect(parseResult.origin.name).toBe("Egriuvu");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Verlassener Außenposten");
    
    // target
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

  test("parses German attack on colony log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Tamani =MS= Echo Fatalis (2873452, Tamani) greift mit Phaser und Stärke 20/20/0 an" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).toBeNull();
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.target).toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.weaponStrength).not.toBeNull();

    expect(parseResult.targetIsColony).toBe(true);
    expect(parseResult.originIsColony).toBe(false);
    
    // parts are set correctly
    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(2873452);
    expect(parseResult.origin.name).toBe("=MS= Echo Fatalis");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Tamani");

    expect(parseResult.weaponName).toBe("Phaser");
    expect(parseResult.isOffensive).toBe(true);
    expect(parseResult.isDefensive).toBe(false);

    // weapon strength
    expect(parseResult.weaponStrength.shieldDamage).toBe(20);
    expect(parseResult.weaponStrength.hullDamage).toBe(20);
    expect(parseResult.weaponStrength.energyDamage).toBe(0);
    
  });

  test("parses German attack on colony with named building log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Sovereign Refit Sprungkosten (69307, Sovereign Refit) greift PewPew mit Quantentorpedo MK 2 und Stärke 130/120/0 an" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).toBeNull();
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.target).toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.weaponStrength).not.toBeNull();

    expect(parseResult.targetIsColony).toBe(true);
    expect(parseResult.originIsColony).toBe(false);
    
    // parts are set correctly
    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(69307);
    expect(parseResult.origin.name).toBe("Sprungkosten");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Sovereign Refit");

    expect(parseResult.weaponName).toBe("Quantentorpedo MK 2");
    expect(parseResult.isOffensive).toBe(true);
    expect(parseResult.isDefensive).toBe(false);

    // weapon strength
    expect(parseResult.weaponStrength.shieldDamage).toBe(130);
    expect(parseResult.weaponStrength.hullDamage).toBe(120);
    expect(parseResult.weaponStrength.energyDamage).toBe(0);
    
  });

  test("parses German colony defense log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Disruptorbatterie von captain dajetschko (67572) schlägt Tamani =MS= Echo Fatalis (2873452, Tamani) mit Disruptor und Stärke 22/22/0 zurück" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.weaponName).not.toBeNull();
    expect(parseResult.weaponStrength).not.toBeNull();

    expect(parseResult.targetIsColony).toBe(false);
    expect(parseResult.originIsColony).toBe(true);
    
    // parts are set correctly
    // origin
    expect(parseResult.origin).toBeInstanceOf(BuildingResult);
    expect(parseResult.origin.name).toBeNull();
    expect(parseResult.origin.type).toBe(BuildingType.disruptorBattery);
    
    // target
    expect(parseResult.target.ncc).toBe(2873452);
    expect(parseResult.target.name).toBe("=MS= Echo Fatalis");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Tamani");

    expect(parseResult.weaponName).toBe("Disruptor");
    expect(parseResult.isOffensive).toBe(false);
    expect(parseResult.isDefensive).toBe(true);

    // weapon strength
    expect(parseResult.weaponStrength.shieldDamage).toBe(22);
    expect(parseResult.weaponStrength.hullDamage).toBe(22);
    expect(parseResult.weaponStrength.energyDamage).toBe(0);
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Vor'Cha Sverð (2353095, Vor'Cha) von ]=SLC=[ Halgar von Tronje --Sky-Vicings - (65330) schlägt Korolev U.S.S. Dracaix (2819313, Korolev) mit klingonischer Disruptor Typ chorgh und Stärke 84/94/0 zurück` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(2353095);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2353095);
    expect(ship.name).toBe("Sverð");
    const ship2 = statistics.ships.getShipByNcc(2819313);
    expect(ship2).not.toBeNull();
    expect(ship2.ncc).toBe(2819313);
    expect(ship2.name).toBe("U.S.S. Dracaix");
  });

  test("registers player character in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Vor'Cha Sverð (2353095, Vor'Cha) von ]=SLC=[ Halgar von Tronje --Sky-Vicings - (65330) schlägt Korolev U.S.S. Dracaix (2819313, Korolev) mit klingonischer Disruptor Typ chorgh und Stärke 84/94/0 zurück` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.playerCharacters.mentionedPlayerCharacters.length).toBe(1);
    const playerCharacter = statistics.playerCharacters.getPlayerCharacterById(65330);
    expect(playerCharacter).not.toBeNull();
    expect(playerCharacter.id).toBe(65330);
    expect(playerCharacter.name).toBe("]=SLC=[ Halgar von Tronje --Sky-Vicings -");
  });

})