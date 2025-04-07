"use strict"

import { Enumify } from "enumify";

class BeamDirection extends Enumify {
  static toTarget = new BeamDirection();
  static fromTarget = new BeamDirection();
  
  static _ = this.closeEnum();
  
}

export default BeamDirection;