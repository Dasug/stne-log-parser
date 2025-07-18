import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import ShieldDamageType from '../../src/line-type/shield-damage-type';
import Statistics from '../../src/statistics/statistics.js';

describe('shield damage line type', () => {
  const lineTypeClass = ShieldDamageType;
  test("has correct tag", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.weaponShotResult, LineTag.damage]));
  }); 
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Schilde von Kubus 2784 (2008590, Kubus) nehmen 7 Schaden, sind jetzt auf 47` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects English entry log line positively", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Shields of Warrior OI8497 (1658087, LX710b) take 10 damage, shield strength is now at 47` };

    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Schilde von Kubus 2784 (2008590, Kubus) nehmen 7 Schaden, sind jetzt auf 47` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2008590);
    expect(parseResult.ship.name).toBe("Kubus 2784");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Kubus");

    expect(parseResult.shieldDamage).toBe(7);
    expect(parseResult.remainingShieldStrength).toBe(47);
    expect(parseResult.shieldsCollapsed).toBe(false);
  });

  test("parses English entry log line correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Shields of Warrior OI8497 (1658087, LX710b) take 10 damage, shield strength is now at 47` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1658087);
    expect(parseResult.ship.name).toBe("Warrior OI8497");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("LX710b");

    expect(parseResult.shieldDamage).toBe(10);
    expect(parseResult.remainingShieldStrength).toBe(47);
    expect(parseResult.shieldsCollapsed).toBe(false);
  });

  test("parses German entry log line with collapsing shields correctly", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Schilde von Kubus 2784 (2008590, Kubus) nehmen 7 Schaden und kollabieren` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(2008590);
    expect(parseResult.ship.name).toBe("Kubus 2784");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Kubus");

    expect(parseResult.shieldDamage).toBe(7);
    expect(parseResult.remainingShieldStrength).toBe(0);
    expect(parseResult.shieldsCollapsed).toBe(true);
  });

  test("parses English entry log line with collapsing shields correctly", () => {
    const testLogEntry = { "lang": "en", "entry": String.raw`Shields of Warrior OI8497 (1658087, LX710b) take 10 damage and collapse` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    
    // parts are set correctly
    // ship
    expect(parseResult.ship.ncc).toBe(1658087);
    expect(parseResult.ship.name).toBe("Warrior OI8497");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("LX710b");

    expect(parseResult.shieldDamage).toBe(10);
    expect(parseResult.remainingShieldStrength).toBe(0);
    expect(parseResult.shieldsCollapsed).toBe(true);
  });

  test("registers ships in statistics", () => {
    const statistics = new Statistics;
    const testLogEntry = { "lang": "de", "entry": String.raw`Schilde von Kubus 2784 (2008590, Kubus) nehmen 7 Schaden, sind jetzt auf 47` };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    lineTypeClass.populateStatistics(statistics, parseResult);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    const ship = statistics.ships.getShipByNcc(2008590);
    expect(ship).not.toBeNull();
    expect(ship.ncc).toBe(2008590);
    expect(ship.name).toBe("Kubus 2784");
  });
})