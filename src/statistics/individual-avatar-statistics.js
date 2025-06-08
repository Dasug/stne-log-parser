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
   * total number of actions performed by the avatar 
   * @type {Number}
   */
  #totalActions = 0;
  
  /**
   * number of successful actions performed by the avatar 
   * @type {Number}
   */
  #successfulActions = 0;

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
   * total number of actions performed by the avatar 
   * @type {Number}
   */
  get totalActions() {
    return this.#totalActions;
  }

  /**
   * number of successful actions performed by the avatar 
   * @type {Number}
   */
  get successfulActions() {
    return this.#successfulActions;
  }

  /**
   * number of unsuccessful actions performed by the avatar 
   * @type {Number}
   */
  get unsuccessfulActions() {
    return this.#totalActions - this.#successfulActions;
  }

  /**
   * success rate of the avatar's actions or null if total actions is zero 
   * @type {?Number}
   */
  get successRate() {
    if(this.#totalActions === 0) {
      return null;
    }
    return this.#successfulActions / this.#totalActions;
  }

  /**
   * register an action performed by the avatar 
   */
  registerAction() {
    this.#totalActions++;
  }

  /**
   * register a successful action performed by the avatar.
   * Does not increment the total action amount, be sure to register an action first
   */
  registerActionSuccess() {
    this.#successfulActions++;
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