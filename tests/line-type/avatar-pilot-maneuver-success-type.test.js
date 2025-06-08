import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarPilotManeuverSuccessType from '../../src/line-type/avatar-pilot-maneuver-success-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('avatar pilot maneuver success line type', () => {
  const lineTypeClass = AvatarPilotManeuverSuccessType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarActionSuccess]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Annett Hirsch (1140807, Pilot) manövriert erfolgreich in einen toten Winkel von Vetro (2838280, Battle Carrier Wrack), wodurch sich die Chance für H_Kahn des Zorn III (2662825, Tamani) ergibt kritische Schäden (x2) zu verursachen!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Annett Hirsch (1140807, Pilot) manövriert erfolgreich in einen toten Winkel von Vetro (2838280, Battle Carrier Wrack), wodurch sich die Chance für H_Kahn des Zorn III (2662825, Tamani) ergibt kritische Schäden (x2) zu verursachen!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Annett Hirsch");
    expect(parseResult.avatar.itemId).toBe(1140807);
    expect(parseResult.avatar.job).toBe(AvatarJob.pilot);

    // target
    expect(parseResult.target.ncc).toBe(2838280);
    expect(parseResult.target.name).toBe("Vetro");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Battle Carrier Wrack");

    // ship
    expect(parseResult.ship.ncc).toBe(2662825);
    expect(parseResult.ship.name).toBe("H_Kahn des Zorn III");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Tamani");
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Annett Hirsch (1140807, Pilot) manövriert erfolgreich in einen toten Winkel von Vetro (2838280, Battle Carrier Wrack), wodurch sich die Chance für H_Kahn des Zorn III (2662825, Tamani) ergibt kritische Schäden (x2) zu verursachen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(2838280);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2838280);
    expect(ship.name).toBe("Vetro");
    const ship2 = statistics.ships.getShipByNcc(2662825);
    expect(ship2).not.toBeNull();
    expect(ship2.ncc).toBe(2662825);
    expect(ship2.name).toBe("H_Kahn des Zorn III");
  });

  test("registers avatar in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Annett Hirsch (1140807, Pilot) manövriert erfolgreich in einen toten Winkel von Vetro (2838280, Battle Carrier Wrack), wodurch sich die Chance für H_Kahn des Zorn III (2662825, Tamani) ergibt kritische Schäden (x2) zu verursachen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.avatars.mentionedAvatars.length).toBe(1);
    const avatar = statistics.avatars.getAvatarByItemId(1140807);
    expect(avatar).not.toBeNull();
    expect(avatar.itemId).toBe(1140807);
    expect(avatar.name).toBe("Annett Hirsch");
    expect(avatar.job).toBe(AvatarJob.pilot);

    // actions
    expect(avatar.totalActions).toBe(0);
    expect(avatar.successfulActions).toBe(1);
  });
})