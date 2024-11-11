"use strict"

import AvatarJob from "../../enum/avatar-job.js";

class AvatarResult {
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
}

export default AvatarResult;