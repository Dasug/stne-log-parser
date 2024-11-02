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
    expect(result.orbit).toBe(false);
    expect(result.mapId).toBe(0);
    expect(result.mapInstanceId).toBe(null);
  });

  test("orbital map coordinates extracts to result class properly", () => {
    const result = MapCoordinates.matchResult("@774|334");
    expect(result).not.toBeNull();
    expect(result.x).toBe(774);
    expect(result.y).toBe(334);
    expect(result.orbit).toBe(true);
    expect(result.mapId).toBe(0);
    expect(result.mapInstanceId).toBe(null);
  });

  test("coordinates on submap extracts to result class properly", () => {
    const result = MapCoordinates.matchResult("3|33#115");
    expect(result).not.toBeNull();
    expect(result.x).toBe(3);
    expect(result.y).toBe(33);
    expect(result.orbit).toBe(false);
    expect(result.mapId).toBe(115);
    expect(result.mapInstanceId).toBe(null);
  });

  test("phase shifted coordinates extract to result class properly", () => {
    const result = MapCoordinates.matchResult("200|300#Phase\\34108");
    expect(result).not.toBeNull();
    expect(result.x).toBe(200);
    expect(result.y).toBe(300);
    expect(result.orbit).toBe(false);
    expect(result.mapId).toBe(101);
    expect(result.mapInstanceId).toBe(34108);
  });
});