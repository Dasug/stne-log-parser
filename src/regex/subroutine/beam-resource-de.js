"use strict"

import {pattern} from 'regex';
import Expression from './expression.js';
import BeamResourceResult from '../parse-result/beam-resource-result.js';
import BeamResource from '../../enum/beam-resource.js';

/**
 * Parses a beam resource name and amount in German language logs.  
 * Examples: `Deuterium: 200`, `Latinum: 10`, `Warkpern: 122,33`
 * Returns the following named groups when matching:  
 * `resource`: name of the resource  
 * `amount`: amount of that resource that is being transported, uses decimal comma instead of decimal point!
 */
class BeamResourceDe extends Expression {
  static regexPattern = pattern`
    (?<resource>
    [^:\.]+
    )
    :\ 
    (?<amount>\d+(?:,\d+)?)
    \.
  `;

  /**
   * @returns {?BeamResourceResult} beam resource data extracted from the text or null if there's no match
   * @inheritdoc 
   */
  static matchResult(text) {
    const match = this.match(text);
    if(match === null) {
      return null;
    }

    const resultObject = new BeamResourceResult;
    // TODO: Add holiday specific resource names
    switch(match.groups.resource) {
      case 'Crew':
        resultObject.resource = BeamResource.crew;
        break;
      case 'Warpkern':
        resultObject.resource = BeamResource.warpCore;
        break;
      case 'Nahrung':
        resultObject.resource = BeamResource.food;
        break;
      case 'Baumaterial':
        resultObject.resource = BeamResource.plasteel;
        break;
      case 'Iridium-Erz':
        resultObject.resource = BeamResource.iridiumOre;
        break;
      case 'Duranium':
        resultObject.resource = BeamResource.duranium;
        break;
      case 'Deuterium':
        resultObject.resource = BeamResource.deuterium;
        break;
      case 'Antimaterie':
        resultObject.resource = BeamResource.antimatter;
        break;
      case 'Photonentorpedos':
        resultObject.resource = BeamResource.photonTorpedoes;
        break;
      case 'Iso-Chips':
        resultObject.resource = BeamResource.isoChips;
        break;
      case 'Rettungskapseln':
        resultObject.resource = BeamResource.escapePods;
        break;
      case 'Dilithium':
        resultObject.resource = BeamResource.dilithium;
        break;
      case 'Artefakte':
        resultObject.resource = BeamResource.unknown; // missing enum entry
        break;
      case 'Tritanium':
        resultObject.resource = BeamResource.tritanium;
        break;
      case 'Sorium':
        resultObject.resource = BeamResource.sorium;
        break;
      case 'Nitrium':
        resultObject.resource = BeamResource.nitrium;
        break;
      case 'Latinum':
        resultObject.resource = BeamResource.latinum;
        break;
      case 'Antiprotonen-Phalanx':
        resultObject.resource = BeamResource.unknown; // missing enum entry
        break;
      case 'Plasma':
        resultObject.resource = BeamResource.plasma;
        break;
      case 'Plasmatorpedos':
        resultObject.resource = BeamResource.plasmaTorpedoes;
        break;
      case 'Quantentorpedos':
        resultObject.resource = BeamResource.quantumTorpedoes;
        break;
      case 'Ketracel White':
        resultObject.resource = BeamResource.ketracelWhite;
        break;
      case 'Blutwein':
        resultObject.resource = BeamResource.bloodWine;
        break;
      case 'Romulanisches Ale':
        resultObject.resource = BeamResource.romulanAle;
        break;
      case 'Rohrlarven':
        resultObject.resource = BeamResource.tubeGrubs;
        break;
      case 'Vinculum':
        resultObject.resource = BeamResource.vinculum;
        break;
      case 'Taspar-Eier':
        resultObject.resource = BeamResource.tasparEggs;
        break;
      case 'Tribbels':
        resultObject.resource = BeamResource.tribbles;
        break;
      case 'Earl Grey':
        resultObject.resource = BeamResource.earlGrey;
        break;
      case 'Schmuggelgüter':
        resultObject.resource = BeamResource.contrabands;
        break;
      case 'Geschenke':
        resultObject.resource = BeamResource.gifts;
        break;
      case 'Credits':
        resultObject.resource = BeamResource.credits;
        break;
      case 'Polarontorpedo':
        resultObject.resource = BeamResource.polaronTorpedoes;
        break;
      case 'Nemesistorpedo':
        resultObject.resource = BeamResource.nemesisTorpedoes;
        break;
      case 'EMP-Torpedo':
        resultObject.resource = BeamResource.empTorpedoes;
        break;
      case 'Baupläne':
        resultObject.resource = BeamResource.unknown; // missing enum entry
        break;
      case 'Larne':
        resultObject.resource = BeamResource.larne;
        break;
      default:
        resultObject.resource = BeamResource.unknown;
    }
    resultObject.amount = Number(match.groups.amount.replaceAll(",", "."));
    return resultObject;
  }
}

export default BeamResourceDe;