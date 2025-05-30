import { describe, expect, test } from '@jest/globals';
import ChangeAlertLevelType from '../../src/line-type/change-alert-level-type.js';
import LineTag from '../../src/enum/line-tag.js';
import AlertLevel from '../../src/enum/alert-level.js';
import Statistics from '../../src/statistics/statistics.js';

describe('change aleret level line type', () => {
  const lineTypeClass = ChangeAlertLevelType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.shipMaintenance]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`[CV] Jäger 20 (2817829, Klaestron) von Bayerisches Imperium [SJV] (76856) geht auf gelben Alarm` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Nitisa Expressway (1499439, Small Subspace Gate) goes to Green Alert` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "[CV] Jäger 20 (2817829, Klaestron) von Bayerisches Imperium [SJV] (76856) geht auf gelben Alarm" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // owner
    expect(parseResult.owner.id).toBe(76856);
    expect(parseResult.owner.name).toBe("Bayerisches Imperium [SJV]");
    // ship
    expect(parseResult.ship.ncc).toBe(2817829);
    expect(parseResult.ship.name).toBe("[CV] Jäger 20");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Klaestron");

    // alert level
    expect(parseResult.alertLevel).toBe(AlertLevel.yellow);
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Nitisa Expressway (1499439, Small Subspace Gate) goes to Green Alert` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).toBeNull();
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1499439);
    expect(parseResult.ship.name).toBe("Nitisa Expressway");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Small Subspace Gate");
    
    // alert level
    expect(parseResult.alertLevel).toBe(AlertLevel.green);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`[CV] Jäger 20 (2817829, Klaestron) von Bayerisches Imperium [SJV] (76856) geht auf gelben Alarm` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2817829);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2817829);
    expect(ship.name).toBe("[CV] Jäger 20");
  });
})