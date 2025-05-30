import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarEnergyRecoveryType from '../../src/line-type/avatar-energy-recovery-type.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import Statistics from '../../src/statistics/statistics.js';

describe('avatar energy recovery line type', () => {
  const lineTypeClass = AvatarEnergyRecoveryType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionSuccess]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Jana Muller (779455, Wartungstechniker) optimiert den Abschuss von {LV} Enyo Sakul * (2228483, Taktischer Kubus) und gewinnt dabei 0,4 Hauptenergie zurück!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Jana Muller (779455, Wartungstechniker) optimiert den Abschuss von {LV} Enyo Sakul * (2228483, Taktischer Kubus) und gewinnt dabei 0,4 Hauptenergie zurück!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Jana Muller");
    expect(parseResult.avatar.itemId).toBe(779455);
    expect(parseResult.avatar.job).toBe(AvatarJob.maintenanceTechnician);

    // ship
    expect(parseResult.ship.ncc).toBe(2228483);
    expect(parseResult.ship.name).toBe("{LV} Enyo Sakul *");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Taktischer Kubus");

    // alert level
    expect(parseResult.energy).toBeCloseTo(0.4);
    
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Jana Muller (779455, Wartungstechniker) optimiert den Abschuss von {LV} Enyo Sakul * (2228483, Taktischer Kubus) und gewinnt dabei 0,4 Hauptenergie zurück!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2228483);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2228483);
    expect(ship.name).toBe("{LV} Enyo Sakul *");
  });
})