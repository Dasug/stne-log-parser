import { describe, expect, test } from '@jest/globals';
import InitializeMainComputerType from '../../src/line-type/initialize-main-computer-type.js';
import LineTag from '../../src/enum/line-tag.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import Statistics from '../../src/statistics/statistics.js';

describe('initialize main computer line type', () => {
  const lineTypeClass = InitializeMainComputerType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.shipMaintenance]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`[CV] Jäger 99 (2818116, Klaestron) von Bayerisches Imperium [SJV] (76856) initialisiert die Startsequenz des Hauptcomputers!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Eveake initialises the boot sequence of the main computer!` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "[CV] Jäger 99 (2818116, Klaestron) von Bayerisches Imperium [SJV] (76856) initialisiert die Startsequenz des Hauptcomputers!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.ship).toBeInstanceOf(ShipNameAndNccResult);
    
    // parts are set correctly
    // owner
    expect(parseResult.owner.id).toBe(76856);
    expect(parseResult.owner.name).toBe("Bayerisches Imperium [SJV]");
    // ship
    expect(parseResult.ship.ncc).toBe(2818116);
    expect(parseResult.ship.name).toBe("[CV] Jäger 99");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Klaestron");
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Eveake initialises the boot sequence of the main computer!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.ship).toBeInstanceOf(ShipNameOnlyResult);
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.name).toBe("Eveake");
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`[CV] Jäger 99 (2818116, Klaestron) von Bayerisches Imperium [SJV] (76856) initialisiert die Startsequenz des Hauptcomputers!` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2818116);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2818116);
    expect(ship.name).toBe("[CV] Jäger 99");
  });
})