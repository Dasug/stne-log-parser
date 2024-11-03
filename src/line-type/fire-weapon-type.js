"use strict"

import PlayerNameAndId from "../regex/player-name-and-id";
import ShipNameAndNcc from "../regex/ship-name-and-ncc";
import WeaponDamage from "../regex/weapon-damage";

import { addSubroutines } from "../util/regex-helper";
import GenericType from "./generic-type";
import { pattern } from "regex";
import FireWeaponResult from "./parse-result/fire-weapon-result";

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
      \ greift\ 

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
      \ an$
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
      \ from\ 
      (?<owner> \g<playerAndId>)
      \ attacks\ 
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

    const resultObject = new FireWeaponResult;
    resultObject.ship = ship;
    resultObject.owner = owner;
    resultObject.target = target;
    resultObject.weaponName = weaponName;
    resultObject.weaponStrength = weaponStrength;

    return resultObject;
  }

  static getTags() {
    return [
      "battle"
    ];
  }
}

export default FireWeaponType;