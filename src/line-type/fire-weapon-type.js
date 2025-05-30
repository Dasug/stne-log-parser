"use strict"

import PlayerNameAndId from "../regex/subroutine/player-name-and-id.js";
import ShipNameAndNcc from "../regex/subroutine/ship-name-and-ncc.js";
import WeaponDamage from "../regex/subroutine/weapon-damage.js";

import { addSubroutines } from "../util/regex-helper.js";
import GenericType from "./generic-type.js";
import { pattern } from "regex";
import FireWeaponResult from "./parse-result/fire-weapon-result.js";
import LineTag from "../../src/enum/line-tag.js";
import Building from "../regex/subroutine/building.js";
import Statistics from "../statistics/statistics.js";
import ShipNameAndNccResult from "../regex/parse-result/ship-name-and-ncc-result.js";

class FireWeaponType extends GenericType {
  static _regexByLanguage = {
    "de": addSubroutines(
      pattern`
      ^
      (?:
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

        |

        # alternatively this could be a building
        (?<building> \g<buildingData>)
      )
      
      # owner information, is occasionally empty
      (?:
        \ von \ 
        (?<owner> \g<playerAndId>)
      )?
      \ (?<attack_type>greift|schlägt)\ +

      # target information, is missing when attacking a colony with an unnamed building
      (?:
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
        \ 
        |
        # alternatively there might be a building name here
        .{1,20}
        \ 
      )?
      mit\ 
      (?<weapon_name> .+)
      \ und\ Stärke\ 
      (?<weapon_strength> \g<weaponStrength>)
      \ (?:an|zurück)?
      \s*
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "buildingData": Building.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "weaponStrength": WeaponDamage.asSubroutineDefinition(),
      }
    ),
    "en": addSubroutines(
      pattern`
      ^
      (?:
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
        

        |

        # alternatively this could be a building
        (?<building> \g<buildingData>)
      )
      # owner information, is occasionally empty
      (?:
        \ (?:from|of)\ 
        (?<owner> \g<playerAndId>)
      )?
      \ (?<attack_type>attacks|retaliates)\ +

      # target information, is missing when attacking a colony
      (?:
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
        \ 
        |
        # alternatively there might be a building name here
        .{1,20}
        \ 
      )?
      with\ 
      (?<weapon_name> .+)
      ,\ Strength\ 
      (?<weapon_strength> \g<weaponStrength>)
      $
      `,
      {
        "shipAndNcc": ShipNameAndNcc.asSubroutineDefinition(),
        "buildingData": Building.asSubroutineDefinition(),
        "playerAndId": PlayerNameAndId.asSubroutineDefinition(),
        "weaponStrength": WeaponDamage.asSubroutineDefinition(),
      }
    )
  }

  static _buildResultObject(matches) {
    const ship = ShipNameAndNcc.matchResult(matches.groups.ship);
    const building = typeof matches.groups.building === "undefined" ? null : Building.matchResult(matches.groups.building);
    const owner = typeof matches.groups.owner === "undefined" ? null : PlayerNameAndId.matchResult(matches.groups.owner);
    const target = typeof matches.groups.target === "undefined" ? null : ShipNameAndNcc.matchResult(matches.groups.target);
    const weaponStrength = WeaponDamage.matchResult(matches.groups.weapon_strength);
    const weaponName = matches.groups.weapon_name;
    const attackType = matches.groups.attack_type;

    const resultObject = new FireWeaponResult;
    resultObject.origin = ship ?? building
    resultObject.owner = owner;
    resultObject.target = target;
    resultObject.weaponName = weaponName;
    resultObject.weaponStrength = weaponStrength;
    resultObject.isOffensive = ["attacks", "greift"].includes(attackType);

    return resultObject;
  }

  /**
   * @inheritdoc
   * @override
   */
  static populateStatistics(/** @type {Statistics}*/ statistics, parseResult) {
    // register ships
    if(parseResult.origin instanceof ShipNameAndNccResult) {
      statistics.ships.registerShip(parseResult.origin);
    }
    if(parseResult.target instanceof ShipNameAndNccResult) {
      statistics.ships.registerShip(parseResult.target);
    }
    
    return statistics;
  }

  static getTags() {
    return [
      LineTag.battle,
      LineTag.weaponShot,
    ];
  }
}

export default FireWeaponType;