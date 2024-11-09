"use strict"

import PlayerNameAndId from "../regex/player-name-and-id.js";
import ShipNameAndNcc from "../regex/ship-name-and-ncc.js";
import WeaponDamage from "../regex/weapon-damage.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import FireWeaponResult from "./parse-result/fire-weapon-result.js";
import LineTag from "./tags/line-tag.js";

class FireWeaponType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      # ship type, is duplicated later
      (?<prefix_ship_class>.+)\ 
      # lookahead to make sure we have that ship class again later so we don't match too much now
      (?=
        # ship name
        .+
        \(
        (?:[a-zA-Z]+-)?
        \d+
        ,\ 
        \k<prefix_ship_class>
        # for Sabre class that ends with a space
        \ ?
        \)
      )
      (?<ship> \g<shipAndNcc>)
      \ von \ 
      (?<owner> \g<playerAndId>)
      \ (?<attack_type>greift|schlägt)\ 

      # target ship type, is duplicated later
      (?<prefix_target_ship_class>.+)\ 
      # lookahead to make sure we have that ship class again later so we don't match too much now
      (?=
        # target ship name
        .+
        \(
        (?:[a-zA-Z]+-)?
        \d+
        ,\ 
        \k<prefix_target_ship_class>
        # for Sabre class that ends with a space
        \ ?
        \)
      )

      (?<target> \g<shipAndNcc>)
      \ mit\ 
      (?<weapon_name> .+)
      \ und\ Stärke\ 
      (?<weapon_strength> \g<weaponStrength>)
      \ (?:an|zurück)$
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "weaponStrength": WeaponDamage.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      # ship type, is duplicated later
      (?<prefix_ship_class>.+)\ 
      # lookahead to make sure we have that ship class again later so we don't match too much now
      (?=
        # ship name
        .+
        \(
        (?:[a-zA-Z]+-)?
        \d+
        ,\ 
        \k<prefix_ship_class>
        # for Sabre class that ends with a space
        \ ?
        \)
      )
      (?<ship> \g<shipAndNcc>)
      \ (?:from|of)\ 
      (?<owner> \g<playerAndId>)
      \ (?<attack_type>attacks|retaliates)\ 
      # target ship type, is duplicated later
      (?<prefix_target_ship_class>.+)\ 
      # lookahead to make sure we have that ship class again later so we don't match too much now
      (?=
        # target ship name
        .+
        \(
        (?:[a-zA-Z]+-)?
        \d+
        ,\ 
        \k<prefix_target_ship_class>
        # for Sabre class that ends with a space
        \ ?
        \)
      )

      (?<target> \g<shipAndNcc>)
      \ with\ 
      (?<weapon_name> .+)
      ,\ Strength\ 
      (?<weapon_strength> \g<weaponStrength>)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "weaponStrength": WeaponDamage.asSubroutineDefinition(),
      }
    )
  }

  static parse(text, language) {
    if (typeof this._regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return null;
    }

    const matches = text.match(this._regexByLanguage[language]);

    if(matches === null) {
      return null;
    }

    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const owner = PlayerNameAndId.matchResult(matches.groups.owner);
    const target = ShipNameAndNcc.matchResult(matches.groups.target);
    const weaponStrength = WeaponDamage.matchResult(matches.groups.weapon_strength);
    const weaponName = matches.groups.weapon_name;
    const attackType = matches.groups.attack_type;

    const resultObject = new FireWeaponResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.target = target;
    resultObject.weaponName = weaponName;
    resultObject.weaponStrength = weaponStrength;
    resultObject.isOffensive = ["attacks", "greift"].includes(attackType);

    return resultObject;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.weaponShot,
    ];
  }
}

export default FireWeaponType;