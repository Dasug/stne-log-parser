"use strict"

import LogDirection from "../../enum/log-direction.js";
import PlayerNameAndIdResult from "./player-name-and-id-result.js";

class LogMessage {
  /**
   * The direction for this log message, e.g. was this log message triggered by or sent to a player
   * @type {LogDirection} 
   */
  logDirection;

  /**
   * The player who triggered or received this log message, depending on the log direction.
   * @type {PlayerNameAndIdResult} 
   */
  player;

  /**
   * The date and time when this log message was created. 
   * @type {Date}
   */
  dateTime;
  
  /**
   * The main content of the log message
   * @type {string}
   */
  messageBody;
}

export default LogMessage;