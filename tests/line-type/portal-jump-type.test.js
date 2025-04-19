import { describe, expect, test } from '@jest/globals';
import PortalJumpType from '../../src/line-type/portal-jump-type.js';
import LineTag from '../../src/enum/line-tag.js';

describe('portal jump line type', () => {
  test("has ship_movement tag", () => {
    expect(PortalJumpType.getTags()).toEqual(expect.arrayContaining([LineTag.shipMovement]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": "Sprung von 1|98 nach 208|188 ausgeführt!" };

    expect(PortalJumpType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": "Jump from 123|456 to 321|654 executed!" };

    expect(PortalJumpType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Sprung von 1|98 nach 208|188 ausgeführt!` };
    const parseResult = PortalJumpType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    
    // parts are set correctly
    // sector
    expect(parseResult.sectorFrom.x).toBe(1);
    expect(parseResult.sectorFrom.y).toBe(98);
    
    expect(parseResult.sectorTo.x).toBe(208);
    expect(parseResult.sectorTo.y).toBe(188);
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Jump from 123|456 to 321|654 executed!` };
    const parseResult = PortalJumpType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    
    // parts are set correctly
    // sector
    expect(parseResult.sectorFrom.x).toBe(123);
    expect(parseResult.sectorFrom.y).toBe(456);
    
    expect(parseResult.sectorTo.x).toBe(321);
    expect(parseResult.sectorTo.y).toBe(654);
  });
})