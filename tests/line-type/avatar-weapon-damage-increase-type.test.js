import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarWeaponDamageIncreaseType from '../../src/line-type/avatar-weapon-damage-increase-type.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import ColonyNameAndIdResult from '../../src/regex/parse-result/colony-name-and-id-result.js';
import Statistics from '../../src/statistics/statistics.js';

describe('avatar weapon damage increase line type', () => {
  const lineTypeClass = AvatarWeaponDamageIncreaseType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionSuccess]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Commander Bravestorm (797593, Waffenoffizier) zielt auf ein kritisches Untersystem wodurch der Angriff von Stormlord (2235413, Imperiale Prometheus) gegen Pluvass (2840934, Verlassene Rhino) um 28% stärker ausfällt!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Commander Bravestorm (797593, Waffenoffizier) zielt auf ein kritisches Untersystem wodurch der Angriff von Stormlord (2235413, Imperiale Prometheus) gegen Pluvass (2840934, Verlassene Rhino) um 28% stärker ausfällt!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Commander Bravestorm");
    expect(parseResult.avatar.itemId).toBe(797593);
    expect(parseResult.avatar.job).toBe(AvatarJob.weaponsOfficier);

    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(2235413);
    expect(parseResult.origin.name).toBe("Stormlord");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Imperiale Prometheus");

    // target
    expect(parseResult.target).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.target.ncc).toBe(2840934);
    expect(parseResult.target.name).toBe("Pluvass");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Verlassene Rhino");

    // damage increase
    expect(parseResult.damageIncrease).toBe(28);
    
  });

  test("parses German log line with colony as target correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Philipp Baecker (1630675, Waffenoffizier) zielt auf eine Schwachstelle wodurch der Angriff von =MS= Echo Fatalis (2873452, Tamani) gegen neu-aut (69619) um 22% stärker ausfällt!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.origin).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Philipp Baecker");
    expect(parseResult.avatar.itemId).toBe(1630675);
    expect(parseResult.avatar.job).toBe(AvatarJob.weaponsOfficier);

    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(2873452);
    expect(parseResult.origin.name).toBe("=MS= Echo Fatalis");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Tamani");

    // target
    expect(parseResult.target).toBeInstanceOf(ColonyNameAndIdResult);
    expect(parseResult.target.id).toBe(69619);
    expect(parseResult.target.name).toBe("neu-aut");

    // damage increase
    expect(parseResult.damageIncrease).toBe(22);
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Commander Bravestorm (797593, Waffenoffizier) zielt auf ein kritisches Untersystem wodurch der Angriff von Stormlord (2235413, Imperiale Prometheus) gegen Pluvass (2840934, Verlassene Rhino) um 28% stärker ausfällt!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(2235413);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2235413);
    expect(ship.name).toBe("Stormlord");
    const ship2 = statistics.ships.getShipByNcc(2840934);
    expect(ship2).not.toBeNull();
    expect(ship2.ncc).toBe(2840934);
    expect(ship2.name).toBe("Pluvass");
  });

  test("registers colony in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Philipp Baecker (1630675, Waffenoffizier) zielt auf eine Schwachstelle wodurch der Angriff von =MS= Echo Fatalis (2873452, Tamani) gegen neu-aut (69619) um 22% stärker ausfällt!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.colonies.mentionedColonies.length).toBe(1);
    const colony = statistics.colonies.getColonyById(69619);
    expect(colony).not.toBeNull();
    expect(colony.id).toBe(69619);
    expect(colony.name).toBe("neu-aut");
  });

  test("registers avatar in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Philipp Baecker (1630675, Waffenoffizier) zielt auf eine Schwachstelle wodurch der Angriff von =MS= Echo Fatalis (2873452, Tamani) gegen neu-aut (69619) um 22% stärker ausfällt!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.avatars.mentionedAvatars.length).toBe(1);
    const avatar = statistics.avatars.getAvatarByItemId(1630675);
    expect(avatar).not.toBeNull();
    expect(avatar.itemId).toBe(1630675);
    expect(avatar.name).toBe("Philipp Baecker");
    expect(avatar.job).toBe(AvatarJob.weaponsOfficier);

    // actions
    expect(avatar.totalActions).toBe(1);
    expect(avatar.successfulActions).toBe(1);
  });
})