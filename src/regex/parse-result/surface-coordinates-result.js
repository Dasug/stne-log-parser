"use strict"

import DisplayableRegexResult from "./displayable-regex-result.js";

class SurfaceCoordinatesResult extends DisplayableRegexResult {
  /**
   * x coordinate
   * @type {number}
   */
  x;

  /**
   * y coordinate
   * @type {number}
   */
  y;

  asDisplayString() {
    return String.raw`${this.x}|${this.y}`;
  }
}

export default SurfaceCoordinatesResult;
