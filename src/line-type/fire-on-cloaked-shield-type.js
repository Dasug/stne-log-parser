"use strict"

import GenericType from "./generic-type.js";
import LineTag from "../../src/enum/line-tag.js";
import { regex } from "regex";
import FireOnCloakedShieldResult from "./parse-result/fire-on-cloaked-shield-result.js";

class FireOnCloakedShieldType extends GenericType {
  static _regexByLanguage = {
    "de": regex`
      ^
      Die\ Sensoren\ registrieren\ eine?\ Energieschwankung,\ wie\ sie\ beim\ Beschuss\ von\ planetaren\ Schilden\ auftritt!
      $
      `,
  }

  static _buildResultObject(matches) {
    return new FireOnCloakedShieldResult;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.weaponShotResult,
    ];
  }
}

export default FireOnCloakedShieldType;
