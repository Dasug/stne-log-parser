"use strict"

import { Enumify } from "enumify";

class DronePilotDroneType extends Enumify {
  static attackDrone = new DronePilotDroneType();
  static decoyDrone = new DronePilotDroneType();

  static _ = this.closeEnum();  
}

export default DronePilotDroneType;