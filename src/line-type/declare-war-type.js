"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import DeclareWarResult from "./parse-result/declare-war-result.js";
import Statistics from "../statistics/statistics.js";

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

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    statistics.playerCharacters.registerPlayerCharacter(parseResult.player);
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.diplomacy,
    ];
  }
}

export default DeclareWarType;