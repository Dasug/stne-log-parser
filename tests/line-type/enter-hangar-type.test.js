import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import EnterHangarType from '../../src/line-type/enter-hangar-type.js';
import Statistics from '../../src/statistics/statistics.js';

describe('enter hangar line type', () => {
  const lineTypeClass = EnterHangarType;
  test("has ship_movement and hangar tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.shipMovement, LineTag.hangar]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Wrath of the Lord 17 (2523448, Klaestron) von Nemesis (17803) fliegt im Sektor 33|66#115 in den Hangar von Sidonia ein` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Tuahe (1501545, Atel) enters the hangar of {=BSC=} Energy Vault A in sector @333|666` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Wrath of the Lord 17 (2523448, Klaestron) von Nemesis (17803) fliegt im Sektor 33|66#115 in den Hangar von Sidonia ein` };
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
    expect(parseResult.ship.ncc).toBe(2523448);
    expect(parseResult.ship.name).toBe("Wrath of the Lord 17");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Klaestron");

    // owner
    expect(parseResult.owner.name).toBe("Nemesis");
    expect(parseResult.owner.id).toBe(17803);
    
    // station
    expect(parseResult.carrier.name).toBe("Sidonia");

    // sector
    expect(parseResult.sector.x).toBe(33);
    expect(parseResult.sector.y).toBe(66);
    expect(parseResult.sector.orbit).toBe(false);
    expect(parseResult.sector.mapId).toBe(115);

    expect(parseResult.isEntry).toBe(true);
    
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Tuahe (1501545, Atel) enters the hangar of {=BSC=} Energy Vault A in sector @783|146` };
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

    expect(parseResult.isEntry).toBe(true);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Wrath of the Lord 17 (2523448, Klaestron) von Nemesis (17803) fliegt im Sektor 33|66#115 in den Hangar von Sidonia ein` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(2);
    const ship = statistics.ships.getShipByNcc(2523448);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2523448);
    expect(ship.name).toBe("Wrath of the Lord 17");
    const ship2 = statistics.ships.getShipByName("Sidonia");
    expect(ship2).not.toBeNull();
    expect(ship2.ncc).toBeNull();
    expect(ship2.name).toBe("Sidonia");
  });
})