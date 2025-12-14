"use strict"

import AvatarJob from "../../enum/avatar-job.js";
import DisplayableRegexResult from "./displayable-regex-result.js";

class AvatarResult extends DisplayableRegexResult {
  /** 
   * name of the avatar
   * @type {string}
  */
  name;
  /**
   * item id of the avatar 
   * @type {number}
  */
  itemId;

  /**
   * job of the avatar
   * @type {AvatarJob}
   */
  job;

  asDisplayString() {
    return String.raw`${this.name} (${this.itemId}, ${this.job.enumKey})`;
  }
}

export default AvatarResult;
