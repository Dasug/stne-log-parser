"use strict"

import AvatarResult from "../regex/parse-result/avatar-result.js";
import IndividualAvatarStatistics from "./individual-avatar-statistics.js";

class AvatarStatistics {
  /**
   * @type {IndividualAvatarStatistics[]}
   */
  #avatars = [];
  /**
   * @type {Object.<Number, IndividualAvatarStatistics>}
   */
  #avatarByItemId = {};

  /**
   * @returns {IndividualAvatarStatistics[]}
   */
  get mentionedAvatars() {
    return this.#avatars.slice();
  }

  /**
   * retrieves an avatar statistics object of the avatar with given item id
   * @param {number} itemId - item id of the avatar
   * @returns {?IndividualAvatarStatistics} - avatar statistics object of the avatar with given item id, or null if not found
   */
  getAvatarByItemId(itemId) {
    return this.#avatarByItemId[itemId] ?? null;
  }

  /**
   * registers or updates an avatar to create statistics
   * @param {?AvatarResult} avatar - avatar to be registered
   * @throws {TypeError} avatar must be a valid type
   * @returns {?IndividualAvatarStatistics} registered or updated avatar statistics object or null if given avatar is null
   */
  registerAvatar(avatar) {
    if(avatar === null || typeof avatar === "undefined") {
      return;
    }
    if(!(avatar instanceof AvatarResult)) {
      throw new TypeError("avatar is not a valid avatar type");
    }

    const avatarAlreadyExists = this.getAvatarByItemId(avatar.itemId) !== null;
    let avatarStatisticsObject = this.getAvatarByItemId(avatar.itemId) ?? new IndividualAvatarStatistics;
    avatarStatisticsObject._updateAvatarDataFromParseResult(avatar);
    
    this.#avatarByItemId[avatar.itemId] = avatarStatisticsObject;
    
    if(!avatarAlreadyExists) {
      this.#avatars.push(avatarStatisticsObject);
    }

    return avatarStatisticsObject;
  }
}

export default AvatarStatistics;