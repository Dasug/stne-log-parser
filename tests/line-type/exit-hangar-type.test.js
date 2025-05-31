import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ExitHangarType from '../../src/line-type/exit-hangar-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('exit hangar line type', () => {
  const lineTypeClass = ExitHangarType;
  test("has ship_movement and hangar tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.shipMovement, LineTag.hangar]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Jasta 11 XI (2671415, Assertive) von Flotten-Admiral Shean (19372) fliegt im Sektor 33|64#115 aus dem Hangar von SMS Kaiser Karl der Große (1956264, Cellship)` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Tuahe (1501545, Atel) flies out of the hangar of {=BSC=} Energy Vault A (1498772, Trading base) in sector @333|666` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Jasta 11 XI (2671415, Assertive) von Flotten-Admiral Shean (19372) fliegt im Sektor 33|64#115 aus dem Hangar von SMS Kaiser Karl der Große (1956264, Cellship)` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.owner).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.carrier).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2671415);
    expect(parseResult.ship.name).toBe("Jasta 11 XI");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Assertive");

    // owner
    expect(parseResult.owner.name).toBe("Flotten-Admiral Shean");
    expect(parseResult.owner.id).toBe(19372);
    
    // station
    expect(parseResult.carrier.name).toBe("SMS Kaiser Karl der Große");
    expect(parseResult.carrier.ncc).toBe(1956264);
    expect(parseResult.carrier.shipClass).toBe("Cellship");

    // sector
    expect(parseResult.sector.x).toBe(33);
    expect(parseResult.sector.y).toBe(64);
    expect(parseResult.sector.orbit).toBe(false);
    expect(parseResult.sector.mapId).toBe(115);

    expect(parseResult.isEntry).toBe(false);
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Tuahe (1501545, Atel) flies out of the hangar of {=BSC=} Energy Vault A (1498772, Trading base) in sector @333|666` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null
    expect(parseResult.owner).toBeNull();
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.sector).not.toBeNull();
    expect(parseResult.carrier).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1501545);
    expect(parseResult.ship.name).toBe("Tuahe");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Atel");
    
    expect(parseResult.carrier.name).toBe("{=BSC=} Energy Vault A");

    expect(parseResult.isEntry).toBe(false);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Jasta 11 XI (2671415, Assertive) von Flotten-Admiral Shean (19372) fliegt im Sektor 33|64#115 aus dem Hangar von SMS Kaiser Karl der Große (1956264, Cellship)` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(2671415);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2671415);
    expect(ship.name).toBe("Jasta 11 XI");
    const ship2 = statistics.ships.getShipByNcc(1956264);
    expect(ship2).not.toBeNull();
    expect(ship2.ncc).toBe(1956264);
    expect(ship2.name).toBe("SMS Kaiser Karl der Große");
  });

  test("registers player character in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Jasta 11 XI (2671415, Assertive) von Flotten-Admiral Shean (19372) fliegt im Sektor 33|64#115 aus dem Hangar von SMS Kaiser Karl der Große (1956264, Cellship)` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.playerCharacters.mentionedPlayerCharacters.length).toBe(1);
    const playerCharacter = statistics.playerCharacters.getPlayerCharacterById(19372);
    expect(playerCharacter).not.toBeNull();
    expect(playerCharacter.id).toBe(19372);
    expect(playerCharacter.name).toBe("Flotten-Admiral Shean");
  });

  test("registers ship ownership in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Jasta 11 XI (2671415, Assertive) von Flotten-Admiral Shean (19372) fliegt im Sektor 33|64#115 aus dem Hangar von SMS Kaiser Karl der Große (1956264, Cellship)` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    const ship = statistics.ships.getShipByNcc(2671415);
    const player = statistics.playerCharacters.getPlayerCharacterById(19372);
    expect(ship.owner).toBe(player);
    expect(player.ships).toContain(ship);
  });
})