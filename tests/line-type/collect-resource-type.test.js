import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import CollectResourceType from '../../src/line-type/collect-resource-type.js';
import Resource from '../../src/enum/resource.js';
import Statistics from '../../src/statistics/statistics.js';

describe('collect resources line type', () => {
  const lineTypeClass = CollectResourceType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.economy]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`=TX0XT= DrEADsTAR (NX-1867924, Iowa Typ Z) von []U.C.W[] DeMaNDrED (72439) hat 838 Deuterium eingesaugt` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "=TX0XT= DrEADsTAR (NX-1867924, Iowa Typ Z) von []U.C.W[] DeMaNDrED (72439) hat 838 Deuterium eingesaugt" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.resource).toBeInstanceOf(Resource);
    expect(parseResult.amount).not.toBeNull();
    
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1867924);
    expect(parseResult.ship.name).toBe("=TX0XT= DrEADsTAR");
    expect(parseResult.ship.nccPrefix).toBe("NX");
    expect(parseResult.ship.shipClass).toBe("Iowa Typ Z");

    // owner
    expect(parseResult.owner.id).toBe(72439);
    expect(parseResult.owner.name).toBe("[]U.C.W[] DeMaNDrED");

    // resource
    expect(parseResult.resource).toBe(Resource.deuterium);
    
    // amount
    expect(parseResult.amount).toBe(838);
  });

  test("parses ore line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Erzsammler (71835, Erewhon) von Dasug1 (NPC-2183) hat 1728 Iridium-Erz gesammelt" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.resource).toBeInstanceOf(Resource);
    expect(parseResult.amount).not.toBeNull();
    
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(71835);
    expect(parseResult.ship.name).toBe("Erzsammler");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Erewhon");

    // owner
    expect(parseResult.owner.id).toBe(2183);
    expect(parseResult.owner.name).toBe("Dasug1");

    // resource
    expect(parseResult.resource).toBe(Resource.iridiumOre);
    
    // amount
    expect(parseResult.amount).toBe(1728);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`TX0XT= DrEADsTAR (NX-1867924, Iowa Typ Z) von []U.C.W[] DeMaNDrED (72439) hat 838 Deuterium eingesaugt` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(1867924);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(1867924);
    expect(ship.name).toBe("TX0XT= DrEADsTAR");
  });

  test("registers player character in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`TX0XT= DrEADsTAR (NX-1867924, Iowa Typ Z) von []U.C.W[] DeMaNDrED (72439) hat 838 Deuterium eingesaugt` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.playerCharacters.mentionedPlayerCharacters.length).toBe(1);
    const playerCharacter = statistics.playerCharacters.getPlayerCharacterById(72439);
    expect(playerCharacter).not.toBeNull();
    expect(playerCharacter.id).toBe(72439);
    expect(playerCharacter.name).toBe("[]U.C.W[] DeMaNDrED");
  });
});