import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarDamageReductionType from '../../src/line-type/avatar-damage-reduction-type.js';

describe('avatar damage reduction line type', () => {
  test("has correct tags", () => {
    expect(AvatarDamageReductionType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionSuccess]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Adept XT-571 (905722, Verteidigungstaktiker) stört die Zielerfassung von Kofes (2839350, Verlassene Adrec), wodurch dessen Angriff auf Storm of Retribution (2551448, Prometheus) um 42% schwächer ausfällt!` };
    
    expect(AvatarDamageReductionType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Adept XT-571 (905722, Verteidigungstaktiker) stört die Zielerfassung von Kofes (2839350, Verlassene Adrec), wodurch dessen Angriff auf Storm of Retribution (2551448, Prometheus) um 42% schwächer ausfällt!" };
    const parseResult = AvatarDamageReductionType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.ship).not.toBeNull();
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Adept XT-571");
    expect(parseResult.avatar.itemId).toBe(905722);
    expect(parseResult.avatar.job).toBe(AvatarJob.defenseTactician);

    // ship
    expect(parseResult.ship.ncc).toBe(2839350);
    expect(parseResult.ship.name).toBe("Kofes");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Verlassene Adrec");

    // target
    expect(parseResult.target.ncc).toBe(2551448);
    expect(parseResult.target.name).toBe("Storm of Retribution");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Prometheus");

    // alert level
    expect(parseResult.damageReduction).toBe(42);
    
  });
})