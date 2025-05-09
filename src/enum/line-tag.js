"use strict"

import { Enumify } from "enumify";

class LineTag extends Enumify {
  static avatarAction = new LineTag();
  static avatarActionSuccess = new LineTag();
  static avatarActionFailure = new LineTag();
  static battle = new LineTag();
  static battleSlots = new LineTag();
  static damage = new LineTag();
  static diplomacy = new LineTag();
  static docking = new LineTag();
  static economy = new LineTag();
  static environmentEffect = new LineTag();
  static generic = new LineTag();
  static hangar = new LineTag();
  /**
   * this log was triggered by an item, other than an avatar
   */
  static item = new LineTag();
  /**
   * This log line is redundant and does not add additional information.
   * It might however be used for clarification or additional flavor.
   */
  static redundant = new LineTag();
  static shipDestruction = new LineTag();
  static shipDisabled = new LineTag();
  static shipMaintenance = new LineTag();
  static shipMovement = new LineTag();
  static systemBlockade = new LineTag();
  static tractorBeam = new LineTag();
  static transport = new LineTag();
  static weaponShot = new LineTag();
  static weaponShotResult = new LineTag();

  static _ = this.closeEnum();
  
}

export default LineTag;