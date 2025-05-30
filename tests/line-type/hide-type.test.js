import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import SystemBlockadeState from '../../src/enum/system-blockade-state.js';
import HideType from '../../src/line-type/hide-type.js';
import HideStatus from '../../src/enum/hide-status.js';
import MapFieldType from '../../src/enum/map-field-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('hide line type', () => {
  const lineTypeClass = HideType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.shipMaintenance]));
  });
  test("detects German hiding log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "KS CLE'HAC 23 12 1 (NX-2517644, Adrec) von Uvig | Dr. T. Roll (73628) versteckt sich bei 176|175 in Großes Asteroidenfeld" };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("detects German reappearing log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Rex Apes XVII (2871412, Adrec) von S||Mâreth McDèrmot (75738) taucht aus dem Versteck bei @176|175 in Großes Asteroidenfeld auf" };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German hiding log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`KS CLE'HAC 23 12 1 (NX-2517644, Adrec) von Uvig | Dr. T. Roll (73628) versteckt sich bei 176|175 in Großes Asteroidenfeld` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.state).not.toBeNull();
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.fieldType).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2517644);
    expect(parseResult.ship.name).toBe("KS CLE'HAC 23 12 1");
    expect(parseResult.ship.nccPrefix).toBe("NX");
    expect(parseResult.ship.shipClass).toBe("Adrec");

    // ship
    expect(parseResult.owner.id).toBe(73628);
    expect(parseResult.owner.name).toBe("Uvig | Dr. T. Roll");
    
    // sector
    expect(parseResult.sector.x).toBe(176);
    expect(parseResult.sector.y).toBe(175);
    expect(parseResult.sector.orbit).toBe(false);

    // state
    expect(parseResult.state).toBe(HideStatus.hidden);

    // fieldType
    expect(parseResult.fieldType).toBe(MapFieldType.largeAsteroidField);
  });

  test("parses German reappearing log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Rex Apes XVII (2871412, Adrec) von S||Mâreth McDèrmot (75738) taucht aus dem Versteck bei @176|175 in Dichter Deuterium-Nebel auf` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.state).not.toBeNull();
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.fieldType).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2871412);
    expect(parseResult.ship.name).toBe("Rex Apes XVII");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Adrec");

    // ship
    expect(parseResult.owner.id).toBe(75738);
    expect(parseResult.owner.name).toBe("S||Mâreth McDèrmot");
    
    // sector
    expect(parseResult.sector.x).toBe(176);
    expect(parseResult.sector.y).toBe(175);
    expect(parseResult.sector.orbit).toBe(true);

    // state
    expect(parseResult.state).toBe(HideStatus.visible);

    // fieldType
    expect(parseResult.fieldType).toBe(MapFieldType.denseDeuteriumNebula);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`KS CLE'HAC 23 12 1 (NX-2517644, Adrec) von Uvig | Dr. T. Roll (73628) versteckt sich bei 176|175 in Großes Asteroidenfeld` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2517644);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2517644);
    expect(ship.name).toBe("KS CLE'HAC 23 12 1");
  });

  test("registers player character in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`KS CLE'HAC 23 12 1 (NX-2517644, Adrec) von Uvig | Dr. T. Roll (73628) versteckt sich bei 176|175 in Großes Asteroidenfeld` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.playerCharacters.mentionedPlayerCharacters.length).toBe(1);
    const playerCharacter = statistics.playerCharacters.getPlayerCharacterById(73628);
    expect(playerCharacter).not.toBeNull();
    expect(playerCharacter.id).toBe(73628);
    expect(playerCharacter.name).toBe("Uvig | Dr. T. Roll");
  });
})