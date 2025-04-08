"use strict"

import { Enumify } from "enumify";

class WeaponsState extends Enumify {
  static active = new WeaponsState();
  static inactive = new WeaponsState();

  static _ = this.closeEnum();  
}

export default WeaponsState;