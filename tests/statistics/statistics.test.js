import { beforeAll, describe, expect, test } from '@jest/globals';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import PlayerNameAndIdResult from '../../src/regex/parse-result/player-name-and-id-result.js';
import Statistics from '../../src/statistics/statistics.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import IndividualShipStatistics from '../../src/statistics/individual-ship-statistics.js';
import IndividualPlayerCharacterStatistics from '../../src/statistics/individual-player-character-statistics.js';
import FireWeaponType from '../../src/line-type/fire-weapon-type.js';
import DestroyShipType from '../../src/line-type/destroy-ship-type.js';
import EnergyDamageType from '../../src/line-type/energy-damage-type.js';
import HullDamageType from '../../src/line-type/hull-damage-type.js';
import ShieldDamageType from '../../src/line-type/shield-damage-type.js';
import MainComputerCrashType from '../../src/line-type/main-computer-crash-type.js';
import FullSystemFailureType from '../../src/line-type/full-system-failure-type.js';
import ArmorAbsorptionType from '../../src/line-type/armor-absorption-type.js';
import ArmorPenetrationType from '../../src/line-type/armor-penetration-type.js';
import AvatarDamageReductionType from '../../src/line-type/avatar-damage-reduction-type.js';
import AvatarDecoyDroneSuccessType from '../../src/line-type/avatar-decoy-drone-success-type.js';
import LogLine from '../../src/log-line.js';
import AvatarResult from '../../src/regex/parse-result/avatar-result.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import { IndividualAvatarStatistics } from '../../src/statistics.index.js';

describe('statistics registration', () => {
  test("registers ship and owner correctly", () => {
    const statistics = new Statistics;
    const ship1 = new ShipNameAndNccResult;
    ship1.name = "MyFirstShip";
    ship1.ncc = 123456;
    ship1.shipClass = "DY-500";

    const owner1 = new PlayerNameAndIdResult;
    owner1.name = "[]U.C.W[] Scorga Empire";
    owner1.id = 34108;
    
    statistics.registerShipAndOwner(ship1, owner1);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    
    const firstShipStatistics = statistics.ships.getShipByNcc(123456);
    expect(firstShipStatistics.name).toBe("MyFirstShip");
    expect(firstShipStatistics.ncc).toBe(123456);
    expect(firstShipStatistics.shipClass).toBe("DY-500");
   
    const player = statistics.playerCharacters.getPlayerCharacterById(34108);
    expect(player.name).toBe("[]U.C.W[] Scorga Empire");
    expect(player.id).toBe(34108);
    expect(firstShipStatistics.owner).toBe(player);
    expect(player.ships).toContain(firstShipStatistics);
  });

  test("shorthand register function", () => {
    const statistics = new Statistics;
    const ship1 = new ShipNameAndNccResult;
    ship1.name = "MyFirstShip";
    ship1.ncc = 123456;
    ship1.shipClass = "DY-500";

    const ship2 = new ShipNameOnlyResult;
    ship2.name = "MySecondShip";

    const owner1 = new PlayerNameAndIdResult;
    owner1.name = "[]U.C.W[] Scorga Empire";
    owner1.id = 34108;

    const avatar1 = new AvatarResult;
    avatar1.itemId = 123456;
    avatar1.job = AvatarJob.deflectorEngineer;
    avatar1.name = "Günther";

    const [
      ship1Stats,
      ship2Stats,
      player1Stats,
      avatar1Stats,
      invalidStats,
      nullStats,
    ] = statistics.register(ship1, ship2, owner1, avatar1, new Array, null);
    expect(ship1Stats).toBeInstanceOf(IndividualShipStatistics);
    expect(ship1Stats.ncc).toBe(123456);
    expect(ship2Stats).toBeInstanceOf(IndividualShipStatistics);
    expect(ship2Stats.name).toBe("MySecondShip");
    expect(player1Stats).toBeInstanceOf(IndividualPlayerCharacterStatistics);
    expect(player1Stats.id).toBe(34108);
    expect(avatar1Stats).toBeInstanceOf(IndividualAvatarStatistics);
    expect(avatar1Stats.name).toBe("Günther");
    expect(invalidStats).toBeNull();
    expect(nullStats).toBeNull();
  });
});

describe('statistics process attack', () => {
  const parseAttack = (rawAttackString) => {
    const rawAttackLines = rawAttackString.split("\n");
    return rawAttackLines.map(line => LogLine.parse(line, "de"));
  };

  beforeAll(() => {
    LogLine.overrideLogLineTypes([
      FireWeaponType,
      DestroyShipType,
      EnergyDamageType,
      HullDamageType,
      ShieldDamageType,
      MainComputerCrashType,
      FullSystemFailureType,
      ArmorAbsorptionType,
      ArmorPenetrationType,
      AvatarDamageReductionType,
      AvatarDecoyDroneSuccessType,
    ]);
  });
  afterAll(() => {
    LogLine.resetLogLineTypes();
  });

  test("process attack", () => {
    const statistics = new Statistics();
    const attack = parseAttack(
      String.raw`Yzato Doatrif (2178717, Yzato) von []U.C.W[] Dachsavar Assguard Incorporated (72714) schlägt Darinaya Brohesh (2261735, Darinaya) mit Disruptor und Stärke 18/18/0 zurück
      Panzerung von Brohesh (2261735, Darinaya) schwächt Angriff um 4 Punkte
      Brohesh (2261735, Darinaya) nimmt 7(+7) Schaden, Hüllenintegrität sinkt auf 0
      Kontakt zu Brohesh (2261735, Darinaya) verloren! Letzte bekannte Position: 229|423`);
    
    // populate statistics so everything is registered
    attack.forEach(line => line.populateStatistics(statistics));

    statistics.processAttack(attack);
    const yzato = statistics.ships.getShipByNcc(2178717);
    const darinaya = statistics.ships.getShipByNcc(2261735);

    expect(yzato.destroyedNum).toBe(1);
    expect(yzato.destroyed).toContain(darinaya);
    expect(darinaya.destroyer).toBe(yzato);
    expect(darinaya.shotsReceived.length).toBe(1);
    expect(darinaya.shotsFired.length).toBe(0);
    expect(darinaya.destroyedByShot.weaponName).toBe("Disruptor");
    expect(darinaya.destroyedByShot.hullDamage).toBe(18);
    expect(darinaya.destroyedByShot.shieldDamage).toBe(18);
    expect(darinaya.destroyedByShot.energyDamage).toBe(0);
    expect(darinaya.destroyedByShot.overkill).toBe(7);
    expect(darinaya.destroyedByShot.effectiveHullDamage).toBe(7);
    expect(darinaya.disabledByShot).toBeNull();
    expect(yzato.shotsFired).toContain(darinaya.destroyedByShot);
  });

  test("process avatar damage reduction", () => {
    const statistics = new Statistics();
    const attack = parseAttack(String.raw`Verteidigungstaktiker (48132, Verteidigungstaktiker) stört die Zielerfassung von Buneock (52946, Iowa), wodurch dessen Angriff auf Zielscheibe (71848, Raumdock) um 19% schwächer ausfällt!
Iowa Buneock (52946, Iowa) von Dasug2 (2186) greift Raumdock Zielscheibe (71848, Raumdock) mit Antiprotonenkanone und Stärke 141/125/0 an
Schilde von Zielscheibe (71848, Raumdock) nehmen 110 Schaden, sind jetzt auf 15882
Panzerung von Zielscheibe (71848, Raumdock) schwächt Angriff um 3 Punkte
Zielscheibe (71848, Raumdock) nimmt 25 Schaden, Hüllenintegrität sinkt auf 14977`);
    
    // populate statistics so everything is registered
    attack.forEach(line => line.populateStatistics(statistics));

    statistics.processAttack(attack);

    const avatar = statistics.avatars.getAvatarByItemId(48132);
    expect(avatar.hullDamageReduction).toBeCloseTo(30);
    expect(avatar.shieldDamageReduction).toBeCloseTo(34);
    expect(avatar.energyDamageReduction).toBeCloseTo(0);

    const iowa = statistics.ships.getShipByNcc(52946);
    expect(iowa.shotsFired.length).toBe(1);
    expect(iowa.shotsFired[0].damageMultiplier).toBeCloseTo(1-0.19);
  });

  test("process avatar shot avoidance with unknown weapon", () => {
    const statistics = new Statistics();
    const attack = parseAttack(String.raw`Staffel Blau 2 58 (2237612, Klaestron) trifft die Köderdrohne von Stephanie Beich (667849, Drohnenpilot) auf Kinder von Tama (2183807, Tamani) mit Disruptor und zerstört sie!`);
    
    // populate statistics so everything is registered
    attack.forEach(line => line.populateStatistics(statistics));

    statistics.processAttack(attack);

    const avatar = statistics.avatars.getAvatarByItemId(667849);
    expect(avatar.hullDamageReduction).toBeCloseTo(0);
    expect(avatar.shieldDamageReduction).toBeCloseTo(0);
    expect(avatar.energyDamageReduction).toBeCloseTo(0);

    const klaestron = statistics.ships.getShipByNcc(2237612);
    const unknownAvoidedShots = avatar.unknownAvoidedShots;
    expect(unknownAvoidedShots.length).toBe(1);
    expect(unknownAvoidedShots[0].weaponName).toBe("Disruptor");
    expect(unknownAvoidedShots[0].shotOrigin).toBe(klaestron);
  });

  test("process avatar shot avoidance with known weapon", () => {
    const statistics = new Statistics();
    const attack1 = parseAttack(String.raw`Klaestron Staffel Blau 2 58 (2237612, Klaestron) von ]=SLC=[Caiera (62625) greift Tamani Kinder von Tama (2183807, Tamani) mit Disruptor und Stärke 20/20/0 an
Schilde von Kinder von Tama (2183807, Tamani) nehmen 17 Schaden, sind jetzt auf 697
Panzerung von Kinder von Tama (2183807, Tamani) schwächt Angriff um 1 Punkte
Kinder von Tama (2183807, Tamani) nimmt 2 Schaden, Hüllenintegrität sinkt auf 1391`);
    const attack2 = parseAttack(String.raw`Staffel Blau 2 58 (2237612, Klaestron) trifft die Köderdrohne von Stephanie Beich (667849, Drohnenpilot) auf Kinder von Tama (2183807, Tamani) mit Disruptor und zerstört sie!`);
    
    // populate statistics so everything is registered
    attack1.forEach(line => line.populateStatistics(statistics));
    attack2.forEach(line => line.populateStatistics(statistics));

    statistics.processAttack(attack1);
    statistics.processAttack(attack2);

    const avatar = statistics.avatars.getAvatarByItemId(667849);
    expect(avatar.hullDamageReduction).toBeCloseTo(20);
    expect(avatar.shieldDamageReduction).toBeCloseTo(20);
    expect(avatar.energyDamageReduction).toBeCloseTo(0);

    const klaestron = statistics.ships.getShipByNcc(2237612);
    const unknownAvoidedShots = avatar.unknownAvoidedShots;
    expect(unknownAvoidedShots.length).toBe(0);
  });
});