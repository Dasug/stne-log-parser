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
    expect(match).toBeNull();
  });
});