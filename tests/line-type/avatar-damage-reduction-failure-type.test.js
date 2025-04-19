import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarDamageReductionFailureType from '../../src/line-type/avatar-damage-reduction-failure-type.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import ColonyNameAndIdResult from '../../src/regex/parse-result/colony-name-and-id-result.js';
describe('avatar damage reduction failure line type', () => {
  test("has correct tags", () => {
    expect(AvatarDamageReductionFailureType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionFailure]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Juliane Reiniger (1336742, Verteidigungstaktiker) versucht die Zielerfassung von Egriuvu (2841450, Verlassener Außenposten) zu stören, hat damit aber keinerlei Erfolg!` };
    
    expect(AvatarDamageReductionFailureType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Juliane Reiniger (1336742, Verteidigungstaktiker) versucht die Zielerfassung von Egriuvu (2841450, Verlassener Außenposten) zu stören, hat damit aber keinerlei Erfolg!" };
    const parseResult = AvatarDamageReductionFailureType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Juliane Reiniger");
    expect(parseResult.avatar.itemId).toBe(1336742);
    expect(parseResult.avatar.job).toBe(AvatarJob.defenseTactician);

    // origin
    expect(parseResult.origin).toBeInstanceOf(ShipNameAndNccResult);
    expect(parseResult.origin.ncc).toBe(2841450);
    expect(parseResult.origin.name).toBe("Egriuvu");
    expect(parseResult.origin.nccPrefix).toBeNull();
    expect(parseResult.origin.shipClass).toBe("Verlassener Außenposten");
    
  });

  test("parses German log line against colony correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Patrick Fitzgerald (943185, Verteidigungstaktiker) versucht die Zielerfassung von Tropico (46961) zu stören, hat damit aber keinerlei Erfolg!" };
    const parseResult = AvatarDamageReductionFailureType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Patrick Fitzgerald");
    expect(parseResult.avatar.itemId).toBe(943185);
    expect(parseResult.avatar.job).toBe(AvatarJob.defenseTactician);

    // origin
    expect(parseResult.origin).toBeInstanceOf(ColonyNameAndIdResult);
    expect(parseResult.origin.id).toBe(46961);
    expect(parseResult.origin.name).toBe("Tropico");
    
  });
})