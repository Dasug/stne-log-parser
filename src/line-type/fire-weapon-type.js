"use strict"

import PlayerNameAndId from "../regex/player-name-and-id";
import ShipNameAndNcc from "../regex/ship-name-and-ncc";
import WeaponDamage from "../regex/weapon-damage";

import { addSubroutines } from "../util/regex-helper";
import GenericType from "./generic-type";
import { pattern } from "regex";
import FireWeaponResult from "./parse-result/fire-weapon-result";
import LineTag from "./tags/line-tag";

class FireWeaponType extends GenericType {
  static #regexByLanguage = {
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