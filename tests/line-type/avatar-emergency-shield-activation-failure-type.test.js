import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarEmergencyShieldActivationFailureType from '../../src/line-type/avatar-emergency-shield-activation-failure-type.js';

describe('avatar emergency shield activation failure line type', () => {
  test("has correct tags", () => {
    expect(AvatarEmergencyShieldActivationFailureType.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarAction, LineTag.avatarActionFailure]));
  });
  test("detects German entry log line positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Patrick Greene (1093078, Verteidigungstaktiker) an Bord von =MS= Aquilon Kratos (2481039, Terran Excelsior Refit) bemerkt die drohnende Gefahr zu spät und schafft es nicht rechtzeitig die Schilde zu aktivieren!` };
    
    expect(AvatarEmergencyShieldActivationFailureType.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Patrick Greene (1093078, Verteidigungstaktiker) an Bord von =MS= Aquilon Kratos (2481039, Terran Excelsior Refit) bemerkt die drohnende Gefahr zu spät und schafft es nicht rechtzeitig die Schilde zu aktivieren!" };
    const parseResult = AvatarEmergencyShieldActivationFailureType.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.ship).not.toBeNull();
        
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Patrick Greene");
    expect(parseResult.avatar.itemId).toBe(1093078);
    expect(parseResult.avatar.job).toBe(AvatarJob.defenseTactician);
    // ship
    expect(parseResult.ship.ncc).toBe(2481039);
    expect(parseResult.ship.name).toBe("=MS= Aquilon Kratos");
    expect(parseResult.ship.nccPrefix).toBeNull();
    expect(parseResult.ship.shipClass).toBe("Terran Excelsior Refit");
    
  });
})