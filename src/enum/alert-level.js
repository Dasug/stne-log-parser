"use strict"

import { Enumify } from "enumify";

class AlertLevel extends Enumify {
  /**
   * Green alert, no reaction
   * unless there is an active state of war
   */
  static green = new AlertLevel();
  /**
   * Yellow alert, reactions only to hostile actions
   * unless there is a active state of war
   * or a ship of an ally with a defense pact reacts to something
   */
  static yellow = new AlertLevel();
  /**
   * Red alert, reactions to all actions regardless of state of war
   */
  static red = new AlertLevel();
  
  static _ = this.closeEnum();
  
}

export default AlertLevel;