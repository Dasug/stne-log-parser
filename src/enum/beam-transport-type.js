"use strict"

import { Enumify } from "enumify";

class BeamTransportType extends Enumify {
  /**
   * beaming a resource without being docked / in hangar, costing energy
   */
  static beam = new BeamTransportType();
  /**
   * transporting resources by either being docked or by being in hangar at no energy cost
   */
  static transport = new BeamTransportType();
  
  static _ = this.closeEnum();
  
}

export default BeamTransportType;