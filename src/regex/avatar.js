"use strict"

import {pattern} from 'regex';
import Expression from './expression.js';
import AvatarResult from './parse-result/avatar-result.js';
import AvatarJob from '../enum/avatar-job.js';

/**
 * Parses an avatar name with item id and job.  
 * Example: `XiloliX ~ I (230718, Drohnenpilot)`  
 * Returns the following named groups when matching:  
 * `avatar_name`: name of the avatar  
 * `avatar_item_id`: item id of the avatar  
 * `avatar_job`: the avatar's job. Note that the exact content of this group depends on the respective game localization  
 */
class Avatar extends Expression {
  static regexPattern = pattern`
    (?<avatar_name>.+)
    \ \(
    (?<avatar_item_id>\d+)
    ,\ 
    (?<avatar_job> (?:[^\(\)]+))
    \)
  `;

  /**
   * @returns {?AvatarResult} avatar data extracted from the text or null if there's no match
   * @inheritdoc 
   */
  static matchResult(text) {
    const match = this.match(text);
    if(match === null) {
      return null;
    }
    
    const resultObject = new AvatarResult;
    resultObject.name = match.groups.avatar_name;
    resultObject.itemId = Number(match.groups.avatar_item_id);
    const avatarJob = match.groups.avatar_job;
    switch(avatarJob.toLowerCase()) {
      case "none":
      case "kein":
      case "keine":
        resultObject.job = AvatarJob.none;
        break;
      case "geologist":
      case "geologe":
        resultObject.job = AvatarJob.geologist;
        break;
      case "weapons officer":
      case "waffenoffizier":
        resultObject.job = AvatarJob.weaponsOfficier;
        break;
      case "reactor engineer":
      case "reaktoringenieur":
        resultObject.job = AvatarJob.reactorEngineer;
        break;
      case "doctor":
      case "doktor":
        resultObject.job = AvatarJob.doctor;
        break;
      case "management officer":
      case "führungsoffizier":
        resultObject.job = AvatarJob.managementOfficer;
        break;
      case "defense tactician":
      case "verteidigungstaktiker":
        resultObject.job = AvatarJob.defenseTactician;
        break;
      case "tactical officer":
      case "taktikoffizier":
        resultObject.job = AvatarJob.tacticalOfficer;
        break;
      case "deflector engineer":
      case "deflektoringenieur":
        resultObject.job = AvatarJob.deflectorEngineer;
        break;
      case "collector engineer":
      case "kollektoringenieur":
        resultObject.job = AvatarJob.collectorEngineer;
        break;
      case "morale officer":
      case "moraloffizier":
        resultObject.job = AvatarJob.moraleOfficer;
        break;
      case "transporter engineer":
      case "transporteringenieur":
        resultObject.job = AvatarJob.transporterEngineer;
        break;
      case "science officer":
      case "wissenschaftsoffizier":
        resultObject.job = AvatarJob.scienceOfficer;
        break;
      case "maintenance technician":
      case "wartungstechniker":
        resultObject.job = AvatarJob.maintenanceTechnician;
        break;
      case "security officer":
      case "sicherheitsoffizier":
        resultObject.job = AvatarJob.securityOfficer;
        break;
      case "drone pilot":
      case "drohnenpilot":
        resultObject.job = AvatarJob.dronePilot;
        break;
      case "pilot":
        resultObject.job = AvatarJob.pilot;
        break;
      default:
        resultObject.job = AvatarJob.unknow;
    }
    return resultObject;
  }
}

export default Avatar;