"use strict"

import GenericType from "./generic-type.js";
import { regex } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import BeamInterruptedResult from "./parse-result/beam-interrupted-result.js";

class BeamInterruptedType extends GenericType {
  static _regexByLanguage = {
    "de": regex`
      ^
      Beam-Sequenz\ wurde\ gestört
      $
      `,
    // TODO: add regex for English log
  }

  static _buildResultObject(matches) {
    const resultObject = new BeamInterruptedResult;
    return resultObject;
  }

  static getTags() {
    return [
      LineTag.transport,
      LineTag.redundant,
    ];
  }
}

export default BeamInterruptedType;