import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/line-type/tags/line-tag.js';
import DestroyShipType from '../../src/line-type/destroy-ship-type.js';

describe('destroy ship line type', () => {
  test("has battle and ship destruction tag", () => {
    expect(DestroyShipType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.shipDestruction]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Kontakt zu Claevi (2842096, Verlassene Cloverfield) von Die Verdammten (NPC-76936) verloren! Letzte bekannte Position: 88|38#115" };

    expect(DestroyShipType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": "Warrior OI8497 (1658087, LX710b) from Orion Syndicate (SNPC-15) was destroyed at 639|290" };

    expect(DestroyShipType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Kontakt zu Claevi (2842096, Verlassene Cloverfield) von Die Verdammten (NPC-76936) verloren! Letzte bekannte Position: 88|38#115` };
    const parseResult = DestroyShipType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2842096);
    expect(parseResult.ship.name).toBe("Claevi");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Verlassene Cloverfield");
    
    // owner
    expect(parseResult.owner.id).toBe(76936);
    expect(parseResult.owner.name).toBe("Die Verdammten");
    expect(parseResult.owner.idPrefix).toBe("NPC");

    // sector
    expect(parseResult.sector.x).toBe(88);
    expect(parseResult.sector.y).toBe(38);
    expect(parseResult.sector.mapId).toBe(115);
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Warrior OI8497 (1658087, LX710b) from Orion Syndicate (SNPC-15) was destroyed at 639|290` };
    const parseResult = DestroyShipType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1658087);
    expect(parseResult.ship.name).toBe("Warrior OI8497");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("LX710b");
    
    // owner
    expect(parseResult.owner.id).toBe(15);
    expect(parseResult.owner.name).toBe("Orion Syndicate");
    expect(parseResult.owner.idPrefix).toBe("SNPC");
    
    // sector
    expect(parseResult.sector.x).toBe(639);
    expect(parseResult.sector.y).toBe(290);
    expect(parseResult.sector.mapId).toBe(0);
  });
})