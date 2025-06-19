"use strict"

import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import Avatar from "../regex/subroutine/avatar.js";
import Statistics from "../statistics/statistics.js";
import AvatarBoardingInterceptedResult from "./parse-result/avatar-boarding-intercepted-result.js";

class AvatarBoardingInterceptedType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<trigger_avatar> \g<avatar>)
      \ von\ 
      (?<ship> \g<shipAndNcc>)
      \ beamt\ sich\ mit\ einem\ Außenteam\ an\ Bord\ von\ 
      (?<target> \g<shipAndNcc>)
      \.\ 
      (?<interceptingAvatar> \g<avatar>)
      \ fängt\ die\ Eindringlinge\ mit\ einem\ eigenen\ Sicherheitsteam\ ab\ und\ startet\ ein\ wildes\ Feuergefecht!
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "avatar": Avatar.asSubroutineDefinition(),
      }
    ),
    // TODO: add regex for English log
  }

  static _buildResultObject(matches) {
    const avatar = Avatar.matchResult(matches.groups.trigger_avatar);
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const target = ShipNameAndNcc.matchResult(matches.groups.target);
    const interceptingAvatar = Avatar.matchResult(matches.groups.interceptingAvatar);

    const resultObject = new AvatarBoardingInterceptedResult;
    resultObject.ship = ship;
    resultObject.target = target;
    resultObject.avatar = avatar;
    resultObject.interceptingAvatar = interceptingAvatar;

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    const [,, avatar, interceptingAvatar] = statistics.register(parseResult.ship, parseResult.target, parseResult.avatar, parseResult.interceptingAvatar);

    avatar.registerAction();
    interceptingAvatar.registerAction();
    interceptingAvatar.registerActionSuccess();
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.avatarAction,
      LineTag.avatarActionFailure,
    ];
  }
}

export default AvatarBoardingInterceptedType;