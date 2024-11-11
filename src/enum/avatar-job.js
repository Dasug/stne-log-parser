"use strict"

import { Enumify } from "enumify";

class AvatarJob extends Enumify {
  /**
   * no job selected, this avatar does nothing
   */
  static none = new AvatarJob();

  static geologist = new AvatarJob();
  static weaponsOfficier = new AvatarJob();
  static reactorEngineer = new AvatarJob();
  static doctor = new AvatarJob();
  static managementOfficer = new AvatarJob();
  static defenseTactician = new AvatarJob();
  static transporterEngineer = new AvatarJob();
  static tacticalOfficer = new AvatarJob();
  static deflectorEngineer = new AvatarJob();
  static collectorEngineer = new AvatarJob();
  static moraleOfficer = new AvatarJob();
  static scienceOfficer = new AvatarJob();
  static maintenanceTechnician = new AvatarJob();
  static securityOfficer = new AvatarJob();
  static dronePilot = new AvatarJob();
  static pilot = new AvatarJob();

  /**
   * avatar job detection failed or there's some weird unknown job
   */
  static unknown = new AvatarJob();
  
  static _ = this.closeEnum();
  
}

export default AvatarJob;