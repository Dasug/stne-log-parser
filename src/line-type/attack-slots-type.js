"use strict"

import GenericType from "./generic-type.js";
import { regex } from "regex";
import LineTag from "./tags/line-tag.js";
import AttackSlotsResult from "./parse-result/attack-slots-result.js";

class AttackSlotsType extends GenericType {
  static #regexByLanguage = {
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

  static detect(text, language) {
    if (typeof this.#regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return false;
    }
    return text.match(this.#regexByLanguage[language]) !== null;
  }

  static parse(text, language) {
    if (typeof this.#regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return null;
    }

    const matches = text.match(this.#regexByLanguage[language]);

    if(matches === null) {
      return null;
    }

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