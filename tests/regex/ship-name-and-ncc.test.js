import { describe, expect, test } from '@jest/globals';
import ShipNameAndNcc from '../../src/regex/ship-name-and-ncc';

describe('ship name and ncc regex', () => {
  test("ShipNameAndNcc matches valid entry", () => {
    expect(ShipNameAndNcc.match("1. Trapo-Links-3133 (2562637, Moringi)")).not.toBeNull();
  });
  test("ShipNameAndNcc matches valid entry with special characters", () => {
    expect(ShipNameAndNcc.match("[Laburec] <äöü>||€¢ (11111) (2527210, Galaxy)")).not.toBeNull();
  });
  test("ShipNameAndNcc matches valid entry with ncc prefix", () => {
    expect(ShipNameAndNcc.match("[Laburec] Eternal Flare (NX-2527210, Galaxy)")).not.toBeNull();
  });
  test("ShipNameAndNcc does not match if ship type is missing", () => {
    expect(ShipNameAndNcc.match("[Laburec] Eternal Flare (2527210)")).toBeNull();
  });
  test("ShipNameAndNcc extracts ship name, ncc, class and ncc prefix", () => {
    const match = ShipNameAndNcc.match("[Laburec] Eternal Flare (NX-2527210, Galaxy)");
    expect(match.groups).not.toBeNull();
    expect(match.groups.ship_name).toBe("[Laburec] Eternal Flare");
    expect(match.groups.ncc_prefix).toBe("NX");
    expect(match.groups.ncc).toBe("2527210");
    expect(match.groups.ship_class).toBe("Galaxy");
  });


  test("ShipNameAndNcc extracts ship name, ncc and class when ncc prefix is missing", () => {
    const match = ShipNameAndNcc.match("1. Trapo-Links-3133 (2562637, Moringi)");
    expect(match.groups).not.toBeNull();
    expect(match.groups.ship_name).toBe("1. Trapo-Links-3133");
    expect(match.groups.ncc_prefix).toBeUndefined();
    expect(match.groups.ncc).toBe("2562637");
    expect(match.groups.ship_class).toBe("Moringi");
  });
});