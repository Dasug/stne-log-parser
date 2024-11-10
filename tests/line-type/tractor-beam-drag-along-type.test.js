import { describe, expect, test } from '@jest/globals';
import TractorBeamDragAlongType from '../../src/line-type/tractor-beam-drag-along-type.js';
import LineTag from '../../src/enum/line-tag.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';

describe('tractor beam drag along line type', () => {
  test("has correct tags", () => {
    expect(TractorBeamDragAlongType.getTags()).toEqual(expect.arrayContaining([LineTag.shipMovement]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Glanz & Gloria (2642114, Kairos) von Kôntránisches VerwaltungsAmt [PeaceInUkraine] (56813) wird im Traktorstrahl hinterhergezogen.` };
    
    expect(TractorBeamDragAlongType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Eveake is pulled by a tractor beam.` };

    expect(TractorBeamDragAlongType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Glanz & Gloria (2642114, Kairos) von Kôntránisches VerwaltungsAmt [PeaceInUkraine] (56813) wird im Traktorstrahl hinterhergezogen." };
    const parseResult = TractorBeamDragAlongType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.ship).toBeInstanceOf(ShipNameAndNccResult);
    
    // parts are set correctly
    // owner
    expect(parseResult.owner.id).toBe(56813);
    expect(parseResult.owner.name).toBe("Kôntránisches VerwaltungsAmt [PeaceInUkraine]");
    // ship
    expect(parseResult.ship.ncc).toBe(2642114);
    expect(parseResult.ship.name).toBe("Glanz & Gloria");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Kairos");
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Eveake is pulled by a tractor beam.` };
    const parseResult = TractorBeamDragAlongType.parse(testLogEntry.entry, testLogEntry.lang);

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
})