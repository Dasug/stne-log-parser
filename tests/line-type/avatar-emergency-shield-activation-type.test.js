import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarEmergencyShieldActivationType from '../../src/line-type/avatar-emergency-shield-activation-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('avatar emergency shield actvation line type', () => {
  const lineTypeClass = AvatarEmergencyShieldActivationType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionSuccess]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Maria Weiss (1124429, Verteidigungstaktiker) an Bord von =MS= Euros Deimos (2558180, Terran Excelsior Refit) reagiert blitzschnell und schafft es in buchstäblich letzter Sekunde den Schildauslöser zu erreichen!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Maria Weiss (1124429, Verteidigungstaktiker) an Bord von =MS= Euros Deimos (2558180, Terran Excelsior Refit) reagiert blitzschnell und schafft es in buchstäblich letzter Sekunde den Schildauslöser zu erreichen!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
        
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Maria Weiss");
    expect(parseResult.avatar.itemId).toBe(1124429);
    expect(parseResult.avatar.job).toBe(AvatarJob.defenseTactician);
    // ship
    expect(parseResult.ship.ncc).toBe(2558180);
    expect(parseResult.ship.name).toBe("=MS= Euros Deimos");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Terran Excelsior Refit");
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Maria Weiss (1124429, Verteidigungstaktiker) an Bord von =MS= Euros Deimos (2558180, Terran Excelsior Refit) reagiert blitzschnell und schafft es in buchstäblich letzter Sekunde den Schildauslöser zu erreichen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2558180);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2558180);
    expect(ship.name).toBe("=MS= Euros Deimos");
  });

  test("registers avatar in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Maria Weiss (1124429, Verteidigungstaktiker) an Bord von =MS= Euros Deimos (2558180, Terran Excelsior Refit) reagiert blitzschnell und schafft es in buchstäblich letzter Sekunde den Schildauslöser zu erreichen!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.avatars.mentionedAvatars.length).toBe(1);
    const avatar = statistics.avatars.getAvatarByItemId(1124429);
    expect(avatar).not.toBeNull();
    expect(avatar.itemId).toBe(1124429);
    expect(avatar.name).toBe("Maria Weiss");
    expect(avatar.job).toBe(AvatarJob.defenseTactician);
  });
})