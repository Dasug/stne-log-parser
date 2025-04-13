import { describe, expect, test } from '@jest/globals';
import Item from '../../../src/regex/subroutine/item.js';

describe('item regex', () => {
  test("avatar matches valid entry", () => {
    expect(Item.match(String.raw`Lackierungsset "Verlassene" für die Klaestron (1592871, 111121)`)).not.toBeNull();
  });
  test("item extracts data properly", () => {
    const match = Item.match(String.raw`Lackierungsset "Verlassene" für die Klaestron (1592871, 111121)`);
    expect(match.groups).not.toBeNull();
    expect(match.groups.item_name).toBe(String.raw`Lackierungsset "Verlassene" für die Klaestron`);
    expect(match.groups.item_id).toBe("1592871");
    expect(match.groups.item_type_id).toBe("111121");
  });

  test("item returns proper resultObject", () => {
    const resultObject = Item.matchResult(String.raw`Lackierungsset "Verlassene" für die Klaestron (1592871, 111121)`);
    expect(resultObject).not.toBeNull();
    expect(resultObject.name).toBe(String.raw`Lackierungsset "Verlassene" für die Klaestron`);
    expect(resultObject.itemId).toBe(1592871);
    expect(resultObject.itemTypeId).toBe(111121);
  });

  test("item returns proper resultObject without item id", () => {
    const resultObject = Item.matchResult(String.raw`Spektralersplitter (111001)`);
    expect(resultObject).not.toBeNull();
    expect(resultObject.name).toBe("Spektralersplitter");
    expect(resultObject.itemTypeId).toBe(111001);
    expect(resultObject.itemId).toBeNull();
  });

});