"use strict"

import { Enumify } from "enumify";

class LogDirection extends Enumify {
  static incoming = new LogDirection();
  static outgoing = new LogDirection();

  static _ = this.closeEnum();  
}

export default LogDirection;