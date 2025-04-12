import { describe, expect, test } from '@jest/globals';
import PlayerNameAndId from '../../src/regex/player-name-and-id';

describe('player name and id regex', () => {
  test("PlayerNameAndId matches and extracts valid entry", () => {
    const match = PlayerNameAndId.match("[]U.C.W[] Scorga Empire (34108)");
    expect(match).not.toBeNull();
    expect(match.groups).not.toBeNull();
    expect(match.groups.player_name).toBe("[]U.C.W[] Scorga Empire");
    expect(match.groups.id_prefix).toBeUndefined();
    expect(match.groups.player_id).toBe("34108");
  });
  test("PlayerNameAndId matches and extracts NPC entry", () => {
    const match = PlayerNameAndId.match("[DE-1] SUPPORT (NPC-50546)");
    expect(match).not.toBeNull();
    expect(match.groups).not.toBeNull();
    expect(match.groups.player_name).toBe("[DE-1] SUPPORT");
    expect(match.groups.id_prefix).toBe("NPC");
    expect(match.groups.player_id).toBe("50546");
  });
  test("PlayerNameAndId does not match ship name and NCC", () => {
    const match = PlayerNameAndId.match("1. Trapo-Links-3133 (2562637, Moringi)");
    const matchResult = PlayerNameAndId.matchResult("1. Trapo-Links-3133 (2562637, Moringi)");
    expect(match).toBeNull();
    expect(matchResult).toBeNull();
  });

  test("PlayerNameAndId matches and extracts NPC entry to result class", () => {
    const result = PlayerNameAndId.matchResult("[DE-1] SUPPORT (NPC-50546)");
    expect(result).not.toBeNull();
    expect(result.name).toBe("[DE-1] SUPPORT");
    expect(result.idPrefix).toBe("NPC");
    expect(result.id).toBe(50546);
  });

  test("Matches even with linebreak between name and ID", () => {
    const result = PlayerNameAndId.matchResult(String.raw`S||Mâreth McDèrmot
(75738)`);
    expect(result).not.toBeNull();
    expect(result.name).toBe("S||Mâreth McDèrmot");
    expect(result.idPrefix).toBeNull();
    expect(result.id).toBe(75738);
  });
});