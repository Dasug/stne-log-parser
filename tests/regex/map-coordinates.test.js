import { describe, expect, test } from '@jest/globals';
import MapCoordinates from '../../src/regex/map-coordinates';

describe('map coordinates regex', () => {
  test("map coordinates matches simple main map coordinates", () => {
    expect(MapCoordinates.match("335|184")).not.toBeNull();
  });

  test("map coordinates extracts x and y coordinates properly", () => {
    const matches = MapCoordinates.match("123|456");
    expect(matches.groups).not.toBeNull();
    expect(matches.groups.x).toBe("123");
    expect(matches.groups.y).toBe("456");
  });

  test("map coordinates extracts to result class properly", () => {
    const result = MapCoordinates.matchResult("543|119");
    expect(result).not.toBeNull();
    expect(result.x).toBe(543);
    expect(result.y).toBe(119);
  });
});