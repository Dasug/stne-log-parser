"use strict"

import { Enumify } from "enumify";

class SystemBlockadeState extends Enumify {
  static raised = new SystemBlockadeState();
  static dropped = new SystemBlockadeState();
  
  static _ = this.closeEnum();
  
}

export default SystemBlockadeState;