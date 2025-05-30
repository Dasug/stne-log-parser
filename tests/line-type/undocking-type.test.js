import { describe, expect, test } from '@jest/globals';
import UndockingType from '../../src/line-type/undocking-type';
import LineTag from '../../src/enum/line-tag.js';
import Statistics from '../../src/statistics/statistics.js';

describe('undocking line type', () => {
  const lineTypeClass = UndockingType;
  test("has ship_movement and docking tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.shipMovement, LineTag.docking]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Jabba T\`PauPau :.: (2508216, T'Pau) von Ashanti (76192) dockt im Sektor 21|88#115 von Lerko /*\\ (2530534, Taktischer Kubus) ab` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`RS Urax (1589926, Nova) von Loki (83929) undocks from =VIPER= Landa Station (1525125, Supply Post) in sector 555|666.` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Jabba T`PauPau :.: (2508216, T'Pau) von Ashanti (76192) dockt im Sektor 21|88#115 von Lerko /*\\ (2530534, Taktischer Kubus) ab" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.station).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2508216);
    expect(parseResult.ship.name).toBe("Jabba T`PauPau :.:");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("T'Pau");
    
    // station
    expect(parseResult.station.name).toBe("Lerko /*\\");
    expect(parseResult.station.ncc).toBe(2530534);
    expect(parseResult.station.shipClass).toBe("Taktischer Kubus");

    // sector
    expect(parseResult.sector.x).toBe(21);
    expect(parseResult.sector.y).toBe(88);
    expect(parseResult.sector.mapId).toBe(115);
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`RS Urax (1589926, Nova) von Loki (83929) undocks from =VIPER= Landa Station (1525125, Supply Post) in sector 555|666.` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.station).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1589926);
    expect(parseResult.ship.name).toBe("RS Urax");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Nova");

    // station
    expect(parseResult.station.name).toBe("=VIPER= Landa Station");
    expect(parseResult.station.ncc).toBe(1525125);
    expect(parseResult.station.shipClass).toBe("Supply Post");
    
    // owner
    expect(parseResult.owner.id).toBe(83929);
    expect(parseResult.owner.name).toBe("Loki");
    expect(parseResult.owner.idPrefix).toBeNull();
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "en", "entry": String.raw`RS Urax (1589926, Nova) von Loki (83929) undocks from =VIPER= Landa Station (1525125, Supply Post) in sector 555|666.` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(1589926);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(1589926);
    expect(ship.name).toBe("RS Urax");
    const ship2 = statistics.ships.getShipByNcc(1525125);
    expect(ship2).not.toBeNull();
    expect(ship2.ncc).toBe(1525125);
    expect(ship2.name).toBe("=VIPER= Landa Station");
  });

  test("registers player character in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "en", "entry": String.raw`RS Urax (1589926, Nova) von Loki (83929) undocks from =VIPER= Landa Station (1525125, Supply Post) in sector 555|666.` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.playerCharacters.mentionedPlayerCharacters.length).toBe(1);
    const playerCharacter = statistics.playerCharacters.getPlayerCharacterById(83929);
    expect(playerCharacter).not.toBeNull();
    expect(playerCharacter.id).toBe(83929);
    expect(playerCharacter.name).toBe("Loki");
  });
})