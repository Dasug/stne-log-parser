import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarDamageReductionType from '../../src/line-type/avatar-damage-reduction-type.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import ColonyNameAndIdResult from '../../src/regex/parse-result/colony-name-and-id-result.js';
import Statistics from '../../src/statistics/statistics.js';

describe('avatar damage reduction line type', () => {
  const lineTypeClass = AvatarDamageReductionType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionSuccess]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Adept XT-571 (905722, Verteidigungstaktiker) stört die Zielerfassung von Kofes (2839350, Verlassene Adrec), wodurch dessen Angriff auf Storm of Retribution (2551448, Prometheus) um 42% schwächer ausfällt!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Adept XT-571 (905722, Verteidigungstaktiker) stört die Zielerfassung von Kofes (2839350, Verlassene Adrec), wodurch dessen Angriff auf Storm of Retribution (2551448, Prometheus) um 42% schwächer ausfällt!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Adept XT-571");
    expect(parseResult.avatar.itemId).toBe(905722);
    expect(parseResult.avatar.job).toBe(AvatarJob.defenseTactician);

    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(2839350);
    expect(parseResult.origin.name).toBe("Kofes");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Verlassene Adrec");

    // target
    expect(parseResult.target.ncc).toBe(2551448);
    expect(parseResult.target.name).toBe("Storm of Retribution");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Prometheus");

    // damage reduction
    expect(parseResult.damageReduction).toBe(42);
    
  });

  test("parses German log line against colony correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Pilatius Obelyn Swain (943193, Verteidigungstaktiker) stört die Zielerfassung von Tropico (46961), wodurch dessen Angriff auf =MS= Hivemother Hexara (2531302, Rei´Kon) um 31% schwächer ausfällt!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Pilatius Obelyn Swain");
    expect(parseResult.avatar.itemId).toBe(943193);
    expect(parseResult.avatar.job).toBe(AvatarJob.defenseTactician);

    // origin
    expect(parseResult.origin).toBeInstanceOf(ColonyNameAndIdResult);
    expect(parseResult.origin.id).toBe(46961);
    expect(parseResult.origin.name).toBe("Tropico");

    // target
    expect(parseResult.target.ncc).toBe(2531302);
    expect(parseResult.target.name).toBe("=MS= Hivemother Hexara");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Rei´Kon");

    // damage reduction
    expect(parseResult.damageReduction).toBe(31);
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Adept XT-571 (905722, Verteidigungstaktiker) stört die Zielerfassung von Kofes (2839350, Verlassene Adrec), wodurch dessen Angriff auf Storm of Retribution (2551448, Prometheus) um 42% schwächer ausfällt!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(2839350);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2839350);
    expect(ship.name).toBe("Kofes");
    const targetShip = statistics.ships.getShipByNcc(2551448);
    expect(targetShip).not.toBeNull();
    expect(targetShip.ncc).toBe(2551448);
    expect(targetShip.name).toBe("Storm of Retribution");
  });

  test("registers colony in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Pilatius Obelyn Swain (943193, Verteidigungstaktiker) stört die Zielerfassung von Tropico (46961), wodurch dessen Angriff auf =MS= Hivemother Hexara (2531302, Rei´Kon) um 31% schwächer ausfällt!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.colonies.mentionedColonies.length).toBe(1);
    const colony = statistics.colonies.getColonyById(46961);
    expect(colony).not.toBeNull();
    expect(colony.id).toBe(46961);
    expect(colony.name).toBe("Tropico");
  });

  test("registers avatar in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Pilatius Obelyn Swain (943193, Verteidigungstaktiker) stört die Zielerfassung von Tropico (46961), wodurch dessen Angriff auf =MS= Hivemother Hexara (2531302, Rei´Kon) um 31% schwächer ausfällt!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.avatars.mentionedAvatars.length).toBe(1);
    const avatar = statistics.avatars.getAvatarByItemId(943193);
    expect(avatar).not.toBeNull();
    expect(avatar.itemId).toBe(943193);
    expect(avatar.name).toBe("Pilatius Obelyn Swain");
    expect(avatar.job).toBe(AvatarJob.defenseTactician);

    // actions
    expect(avatar.totalActions).toBe(1);
    expect(avatar.successfulActions).toBe(1);
  });
})