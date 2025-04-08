"use strict"

import { Enumify } from "enumify";

class HideStatus extends Enumify {
  static hidden = new HideStatus();
  static visible = new HideStatus();

  static _ = this.closeEnum();  
}

export default HideStatus;