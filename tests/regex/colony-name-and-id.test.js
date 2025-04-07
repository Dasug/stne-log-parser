import { describe, expect, test } from '@jest/globals';
import ColonyNameAndId from '../../src/regex/colony-name-and-id.js';

describe('colony name and id regex', () => {
  test("PlayerNameAndId matches and extracts valid entry", () => {
    const match = ColonyNameAndId.match("[March] Vorash (23296)");
    expect(match).not.toBeNull();
    expect(match.groups).not.toBeNull();
    expect(match.groups.colony_name).toBe("[March] Vorash");
    expect(match.groups.colony_id).toBe("23296");
  });

  test("PlayerNameAndId matches and extracts NPC entry to result class", () => {
    const result = ColonyNameAndId.matchResult("[March] Vorash (23296)");
    expect(result).not.toBeNull();
    expect(result.name).toBe("[March] Vorash");
    expect(result.id).toBe(23296);
  });
});