import { describe, expect, test } from '@jest/globals';
import UndockingType from '../../src/line-type/undocking-type';
import LineTag from '../../src/enum/line-tag.js';

describe('undocking line type', () => {
  test("has ship_movement and docking tag", () => {
    expect(UndockingType.getTags()).toEqual(expect.arrayContaining([LineTag.shipMovement, LineTag.docking]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Jabba T\`PauPau :.: (2508216, T'Pau) von Ashanti (76192) dockt im Sektor 21|88#115 von Lerko /*\\ (2530534, Taktischer Kubus) ab` };
    
    expect(UndockingType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`RS Urax (1589926, Nova) von Loki (83929) undocks from =VIPER= Landa Station (1525125, Supply Post) in sector 555|666.` };

    expect(UndockingType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Jabba T`PauPau :.: (2508216, T'Pau) von Ashanti (76192) dockt im Sektor 21|88#115 von Lerko /*\\ (2530534, Taktischer Kubus) ab" };
    const parseResult = UndockingType.parse(testLogEntry.entry, testLogEntry.lang);

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
    const parseResult = UndockingType.parse(testLogEntry.entry, testLogEntry.lang);

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
})