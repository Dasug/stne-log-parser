"use strict"

import { Enumify } from "enumify";

class LineTag extends Enumify {
  static battle = new LineTag();
  static damage = new LineTag();
  static docking = new LineTag();
  static generic = new LineTag();
  /**
   * This log line is redundant and does not add additional information.
   * It might however be used for clarification or additional flavor.
   */
  static redundant = new LineTag();
  static shipDestruction = new LineTag();
  static shipDisabled = new LineTag();
  static shipMaintenance = new LineTag();
  static shipMovement = new LineTag();
  static weaponShot = new LineTag();
  static weaponShotResult = new LineTag();

  static _ = this.closeEnum();
  
}

export default LineTag;