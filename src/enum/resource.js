"use strict"

import { Enumify } from "enumify";

class Resource extends Enumify {
  
  static antimatter = new Resource();
  static bloodWine = new Resource();
  static contrabands = new Resource();
  static credits = new Resource();
  static deuterium = new Resource();
  static dilithium = new Resource();
  static duranium = new Resource();
  static earlGrey = new Resource();
  static escapePods = new Resource();
  static empTorpedoes = new Resource();
  static food = new Resource();
  static gifts = new Resource();
  static iridiumOre = new Resource();
  static isoChips = new Resource();
  static ketracelWhite = new Resource();
  static latinum = new Resource();
  static nemesisTorpedoes = new Resource();
  static nitrium = new Resource();
  static photonTorpedoes = new Resource();
  static plasma = new Resource();
  static plasmaTorpedoes = new Resource();
  static plasteel = new Resource();
  static polaronTorpedoes = new Resource();
  static quantumTorpedoes = new Resource();
  static romulanAle = new Resource();
  static sorium = new Resource();
  static tasparEggs = new Resource();
  static tribbles = new Resource();
  static tritanium = new Resource();
  static tubeGrubs = new Resource();
  static vinculum = new Resource();
  
  static unknown = new Resource();
  
  static _ = this.closeEnum();
}

export default Resource;