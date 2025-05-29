import { describe, expect, test } from '@jest/globals';
import LineTag from '../../src/enum/line-tag.js';
import AvatarJob from '../../src/enum/avatar-job.js';
import AvatarAttackDroneCritType from '../../src/line-type/avatar-attack-drone-crit-type.js';

describe('avatar attack drone crit line type', () => {
  const lineTypeClass = AvatarAttackDroneCritType;
  test("has correct tags", () => {
    expect(lineTypeClass.getTags()).toEqual(expect.arrayContaining([LineTag.battle, LineTag.avatarActionSuccess]));
  });
  test("detects German entry log line (hull damage) positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Die Drohne trifft und setzt am Einschlagort die Notfallkraftfelder von Naytrop (2839283, Verlassene Adrec) durch einen EMP-Impuls außer Gefecht, wodurch sich die Chance für Gideon Ravenor (797595, Drohnenpilot) ergibt kritische Schäden (x2) gegen Naytrop (2839283, Verlassene Adrec) zu verursachen!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });
  test("detects German entry log line (shield damage) positively", () => {
    const testLogEntry = { "lang": "de", "entry": String.raw`Die Drohne trifft und destabilisiert das Schildgitter von [U] Portal Generator (2822090, Portal Generator) durch einen EMP-Impuls, wodurch sich die Chance für Tom Herz (1555792, Drohnenpilot) ergibt kritische Schäden (x2) gegen [U] Portal Generator (2822090, Portal Generator) zu verursachen!` };
    
    expect(lineTypeClass.detect(testLogEntry.entry, testLogEntry.lang)).toBe(true);
  });

  test("parses German entry log line (hull damage) correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Die Drohne trifft und setzt am Einschlagort die Notfallkraftfelder von Naytrop (2839283, Verlassene Adrec) durch einen EMP-Impuls außer Gefecht, wodurch sich die Chance für Gideon Ravenor (797595, Drohnenpilot) ergibt kritische Schäden (x2) gegen Naytrop (2839283, Verlassene Adrec) zu verursachen!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Gideon Ravenor");
    expect(parseResult.avatar.itemId).toBe(797595);
    expect(parseResult.avatar.job).toBe(AvatarJob.dronePilot);

    // target
    expect(parseResult.target.ncc).toBe(2839283);
    expect(parseResult.target.name).toBe("Naytrop");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Verlassene Adrec");
    
  });

  test("parses German entry log line (shield damage) correctly", () => {
    const testLogEntry = { "lang": "de", "entry": "Die Drohne trifft und destabilisiert das Schildgitter von [U] Portal Generator (2822090, Portal Generator) durch einen EMP-Impuls, wodurch sich die Chance für Tom Herz (1555792, Drohnenpilot) ergibt kritische Schäden (x2) gegen [U] Portal Generator (2822090, Portal Generator) zu verursachen!" };
    const parseResult = lineTypeClass.parse(testLogEntry.entry, testLogEntry.lang);

    // result is not null
    expect(parseResult).not.toBeNull();
    
    // parts are not null if present
    expect(parseResult.avatar).not.toBeNull();
    expect(parseResult.target).not.toBeNull();
    
    // parts are set correctly
    // avatar
    expect(parseResult.avatar.name).toBe("Tom Herz");
    expect(parseResult.avatar.itemId).toBe(1555792);
    expect(parseResult.avatar.job).toBe(AvatarJob.dronePilot);

    // target
    expect(parseResult.target.ncc).toBe(2822090);
    expect(parseResult.target.name).toBe("[U] Portal Generator");
    expect(parseResult.target.nccPrefix).toBeNull();
    expect(parseResult.target.shipClass).toBe("Portal Generator");
    
  });
})