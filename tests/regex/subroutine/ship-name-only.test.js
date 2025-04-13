import ShipNameOnly from "../../../src/regex/subroutine/ship-name-only.js";

// kind of pointless but here we go
describe('ship name only regex', () => {
  test("ShipNameOnly matches really long but valid name", () => {
    expect(ShipNameOnly.match("Aobrouf (zerstört)(Wrack) (zerstört)(Wrack)")).not.toBeNull();
  });
});