"use strict"

import { Enumify } from "enumify";

class OrbitEntryDirection extends Enumify {
  /**
   * entering the orbit
   */
  static entry = new OrbitEntryDirection();
  /**
   * exiting the orbit
   */
  static exit = new OrbitEntryDirection();
  
  static _ = this.closeEnum();
  
}

export default OrbitEntryDirection;