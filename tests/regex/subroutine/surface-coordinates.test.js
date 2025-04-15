import { describe, expect, test } from '@jest/globals';
import SurfaceCoordinates from '../../../src/regex/subroutine/surface-coordinates.js';

describe('surface coordinates regex', () => {
  test("furface coordinates matches coordinates", () => {
    expect(SurfaceCoordinates.match("4|18")).not.toBeNull();
  });

  test("surface coordinates extracts x and y coordinates properly", () => {
    const matches = SurfaceCoordinates.match("12|4");
    expect(matches.groups).not.toBeNull();
    expect(matches.groups.x).toBe("12");
    expect(matches.groups.y).toBe("4");
  });

  test("surface coordinates parses x and y coordinates properly", () => {
    const resultObject = SurfaceCoordinates.matchResult("8|3");
    expect(resultObject.x).toBe(8);
    expect(resultObject.y).toBe(3);
  });
});