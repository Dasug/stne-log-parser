"use strict"

import Resource from "./resource.js";

class BeamResource extends Resource {
  static crew = new BeamResource();
  static energy = new BeamResource();
  static larne = new BeamResource();
  static item = new BeamResource();
  static warpCore = new BeamResource();

  static _ = this.closeEnum();
}

export default BeamResource;