"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import DeclareWarResult from "./parse-result/declare-war-result.js";

class DeclareWarType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      Siedler\ 
      (?<player> \g<playerAndId>)
      \ hat\ dir\ den\ Krieg\ erklärt\.$
      `,
      {
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    ),
    // TODO: Add English regex
  }

  static _buildResultObject(matches) {
    const player = PlayerNameAndId.matchResult(matches.groups.player);
    
    const resultObject = new DeclareWarResult;
    resultObject.player = player;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.diplomacy,
    ];
  }
}

export default DeclareWarType;