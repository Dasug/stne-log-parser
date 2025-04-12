import { describe, expect, test } from '@jest/globals';
import WeaponDamage from '../../src/regex/subroutine/weapon-damage.js';

describe('weapon damage regex', () => {
  test("WeaponDamage matches and extracts valid entry", () => {
    const match = WeaponDamage.match("100/115/0");
    expect(match).not.toBeNull();
    expect(match.groups).not.toBeNull();
    expect(match.groups.shield_damage).toBe("100");
    expect(match.groups.hull_damage).toBe("115");
    expect(match.groups.energy_damage).toBe("0");
  });

  test("WeaponDamage matches and extracts entry to result class", () => {
    const result = WeaponDamage.matchResult("22/44/66");
    expect(result).not.toBeNull();
    expect(result.shieldDamage).toBe(22);
    expect(result.hullDamage).toBe(44);
    expect(result.energyDamage).toBe(66);
  });
});