"use strict"

import PlayerNameAndId from "../regex/player-name-and-id.js";
import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import LineTag from "../../src/enum/line-tag.js";
import ShipNameOnly from "../regex/ship-name-only.js";
import CollectResourceResult from "./parse-result/collect-resource-result.js";
import Resource from "../enum/resource.js";

class CollectResourceType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?<ship> \g<shipAndNcc>|\g<shipNameOnly>)
      (?:
        \ von \ 
        (?<owner> \g<playerAndId>)
      )?
      \ hat\ 
      (?<amount> \d+)
      \ 
      (?<resource> Deuterium|Iridium-Erz)
      \ 
      (?: eingesaugt|gesammelt)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "shipNameOnly": ShipNameOnly.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
      }
    ),
    // TODO: add English pattern
  }

  static _buildResultObject(matches) {
    const shipWithNccMatch = ShipNameAndNcc.matchResult(matches.groups.ship);
    const ship = shipWithNccMatch !== null ? shipWithNccMatch : ShipNameOnly.matchResult(matches.groups.ship);
    const owner = typeof matches.groups.owner === "undefined" ? null : PlayerNameAndId.matchResult(matches.groups.owner);
    const amount = Number(matches.groups.amount);
    let resource = Resource.unknown;
    switch (matches.groups.resource) {
      case "Deuterium":
        resource = Resource.deuterium;
        break;
      case "Iridium-Erz":
        resource  = Resource.iridiumOre;
        break;
    }

    const resultObject = new CollectResourceResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.amount = amount;
    resultObject.resource = resource;

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.economy,
    ];
  }
}

export default CollectResourceType;