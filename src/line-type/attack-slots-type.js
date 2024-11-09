"use strict"

import GenericType from "./generic-type.js";
import { regex } from "regex";
import LineTag from "./tags/line-tag.js";
import AttackSlotsResult from "./parse-result/attack-slots-result.js";

class AttackSlotsType extends GenericType {
  static _regexByLanguage = {
    "de": regex`
      ^
      (?<attack_slots_amount> \d+(?:[,\.]\d+)?)
      \ Angriffskosten
      $
      `,
    "en": regex`
      ^
      (?<attack_slots_amount> \d+(?:[,\.]\d+)?)
      \ Slots\ Attack\ Cost
      $
      `,
  }

  static _buildResultObject(matches) {
    const slotAmount = Number(matches.groups.attack_slots_amount.replace(",", "."));

    const resultObject = new AttackSlotsResult;
    resultObject.slots = slotAmount;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.battleSlots,
    ];
  }
}

export default AttackSlotsType;