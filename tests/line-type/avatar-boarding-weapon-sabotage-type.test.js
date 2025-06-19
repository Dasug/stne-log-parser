import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import Statistics from '../../src/statistics/statistics.js';
import AvatarBoardingWeaponSabotageType from '../../src/line-type/avatar-boarding-weapon-sabotage-type.js';

describe('avatar boarding weapon sabotage line type', () => {
  const lineTypeClass = AvatarBoardingWeaponSabotageType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionSuccess, LineTag.weaponShot]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Tmaeb (800798, Sicherheitsoffizier) von ]=SLC=[ Erzengel Michael (2217323, Tamani) beamt sich mit einem Außenteam an Bord von V.S.S. Midway (2214160, Großes Subraumportal). Durch eine geschickte Sabotage der Nemesis-Torpedo, kann der gerade erfolgte Abschuss aufgehalten werden und explodiert in der Abschussvorrichtung von V.S.S. Midway (2214160, Großes Subraumportal).` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Tmaeb (800798, Sicherheitsoffizier) von ]=SLC=[ Erzengel Michael (2217323, Tamani) beamt sich mit einem Außenteam an Bord von V.S.S. Midway (2214160, Großes Subraumportal). Durch eine geschickte Sabotage der Nemesis-Torpedo, kann der gerade erfolgte Abschuss aufgehalten werden und explodiert in der Abschussvorrichtung von V.S.S. Midway (2214160, Großes Subraumportal)." };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Tmaeb");
    expect(parseResult.avatar.itemId).toBe(800798);
    expect(parseResult.avatar.job).toBe(AvatarJob.securityOfficer);

    // ship
    expect(parseResult.ship.ncc).toBe(2217323);
    expect(parseResult.ship.name).toBe("]=SLC=[ Erzengel Michael");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Tamani");

    // target
    expect(parseResult.target.ncc).toBe(2214160);
    expect(parseResult.target.name).toBe("V.S.S. Midway");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Großes Subraumportal");

    // weapon
    expect(parseResult.weaponName).toBe("Nemesis-Torpedo");
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Tmaeb (800798, Sicherheitsoffizier) von ]=SLC=[ Erzengel Michael (2217323, Tamani) beamt sich mit einem Außenteam an Bord von V.S.S. Midway (2214160, Großes Subraumportal). Durch eine geschickte Sabotage der Nemesis-Torpedo, kann der gerade erfolgte Abschuss aufgehalten werden und explodiert in der Abschussvorrichtung von V.S.S. Midway (2214160, Großes Subraumportal).` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(2217323);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2217323);
    expect(ship.name).toBe("]=SLC=[ Erzengel Michael");
    const targetShip = statistics.ships.getShipByNcc(2214160);
    expect(targetShip).not.toBeNull();
    expect(targetShip.ncc).toBe(2214160);
    expect(targetShip.name).toBe("V.S.S. Midway");
  });

  test("registers avatar in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Tmaeb (800798, Sicherheitsoffizier) von ]=SLC=[ Erzengel Michael (2217323, Tamani) beamt sich mit einem Außenteam an Bord von V.S.S. Midway (2214160, Großes Subraumportal). Durch eine geschickte Sabotage der Nemesis-Torpedo, kann der gerade erfolgte Abschuss aufgehalten werden und explodiert in der Abschussvorrichtung von V.S.S. Midway (2214160, Großes Subraumportal).` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.avatars.mentionedAvatars.length).toBe(1);
    const avatar = statistics.avatars.getAvatarByItemId(800798);
    expect(avatar).not.toBeNull();
    expect(avatar.itemId).toBe(800798);
    expect(avatar.name).toBe("Tmaeb");
    expect(avatar.job).toBe(AvatarJob.securityOfficer);

    // actions
    expect(avatar.totalActions).toBe(1);
    expect(avatar.successfulActions).toBe(1);
  });
})