"use strict"

import { Enumify } from "enumify";

class LineTag extends Enumify {
  static battle = new LineTag();
  static docking = new LineTag();
  static generic = new LineTag();
  static shipMaintenance = new LineTag();
  static shipMovement = new LineTag();

  static _ = this.closeEnum();
  
}

export default LineTag;