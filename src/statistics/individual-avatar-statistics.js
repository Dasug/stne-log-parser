"use strict"

import AvatarJob from "../enum/avatar-job.js";
import AvatarResult from "../regex/parse-result/avatar-result.js";

class IndividualAvatarStatistics {
  /** 
   * name of the avatar
   * @type {?String}
  */
  #name;
  /**
   * item id of the avatar 
   * @type {?Number}
  */
  #itemId;

  /**
   * job of the avatar
   * @type {?AvatarJob}
   */
  #job;

  /** 
   * name of the avatar
   * @type {?String}
  */
  get name() {
    return this.#name ?? null;
  }

  /**
   * item id of the avatar 
   * @type {?Number}
  */
  get itemId() {
    return this.#itemId ?? null;
  }

  /**
   * job of the avatar
   * @type {AvatarJob}
   */
  get job() {
    return this.#job ?? AvatarJob.unknown;
  }

  /**
   * updates the avatars's basic data using an avatar parse result
   * Do not use outside of {@link AvatarStatistics#registerAvatar}, as doing so will break the avatar registration!
   * If you need to manually update the basic avatar data, use {@link AvatarStatistics#registerAvatar}!
   * @param {AvatarResult} avatar - A parse result for an avatar
   */
  _updateAvatarDataFromParseResult(avatar) {
    this.#itemId = avatar.itemId ?? this.#itemId;
    this.#name = avatar.name ?? this.#name;
    this.#job = avatar.job ?? this.#job;
  }
}

export default IndividualAvatarStatistics;