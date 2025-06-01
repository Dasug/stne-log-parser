"use strict";

import LineTag from "./enum/line-tag.js";
import LogDirection from "./enum/log-direction.js";
import LogLine from "./log-line.js";
import LogHeadParser from "./regex/log-head-parser.js";
import LogMessage from "./regex/parse-result/log-message.js";
import PlayerNameAndId from "./regex/subroutine/player-name-and-id.js";
import Statistics from "./statistics/statistics.js";

class LogEntry {
  /**
   * @param {LogMessage} header log message with pre-parsed header information
   */
  #header;

  /**
   * @param {LogLine[]} parsedLines Array of parsed log lines
   */
  #parsedLines = [];

  /**
   * @var {?Statistics} statistics object for this log entry
   */
  #statistics;

  /**
   * the header of this log entry
   * @type {LogMessage}
   */
  get header() { return this.#header; }
  
  /**
   * the log direction (incoming or outgoing)
   * @type {LogDirection}
   */
  get logDirection() { return this.#header?.logDirection; }
  
  /**
   * the player who triggered or received the log message, depending on the log direction
   * @type {PlayerNameAndId}
   */
  get player() { return this.#header?.player; }
  
  /**
   * the date and time of the log entry
   * @type {Date}
   */
  get dateTime() { return this.#header?.dateTime; }
  
  /**
   * the unparsed body of the log entry
   * @type {String}
   */
  get messageBody() { return this.#header?.messageBody; }
  
  /**
   * the parsed lines of the log entry
   * @type {LogLine[]}
   */
  get parsedLines() { return this.#parsedLines; }

  /**
   * the statistics for this log entry only. Only available if buildStatistics has been called beforehand
   * @type {?Statistics}
   */
  get statistics() { return this.#statistics ?? null; }

  /**
   * Builds a statistics object containing only this log entry's data.
   * Also makes the object available in the statistics attribute.
   * @returns {Statistics} created statistics object 
   */
  buildStatistics() {
    const statistics = new Statistics;
    statistics.register(this.player);
    this.parsedLines.forEach(/** @var {LogLine} */ line => line.populateStatistics(statistics));
    const attacks = this.findAttacks();
    statistics.processAttacks(attacks);

    this.#statistics = statistics;

    return statistics;
  }

  /**
   * populates the statistics object with this log entry's statistics
   * @param {Statistics} statistics statistics object
   * @returns {Statistics} statistics object populated with this log entry's statistics
   */
  populateStatistics(statistics) {
    statistics.register(this.player);
    this.parsedLines.forEach(/** @var {LogLine} */ line => line.populateStatistics(statistics));
    const attacks = this.findAttacks();
    statistics.processAttacks(attacks);
    
    return statistics;
  }

  /**
   * finds and returns all log lines that are part of an attack, groups by the attack
   * 
   * An attack is considered a weapon shot plus the weapon shot result including any avatar actions.
   * Undetected log lines are considered as part of an attack as it's more likely than not that they are
   * and considering them as such avoids falsely breaking up attacks.
   * @returns {Array<Array<LogLine>>}
   */
  findAttacks() {
    const attacks = [];
    let currentAttack = null;
    let inBattleResultPhase = false;
    const lineTypesThatContinueBattleResultPhase = [
      LineTag.weaponShotResult,
      LineTag.shipDestruction,
      LineTag.shipDisabled
    ];
    for (let index = 0; index < this.#parsedLines.length; index++) {
      /**
       * @type {LogLine}
       */
      const logLine = this.#parsedLines[index];
      if(currentAttack === null && logLine.tags.includes(LineTag.battle)) {
        currentAttack = [logLine];
        attacks.push(currentAttack);
      } else if(currentAttack !== null) {
        // presume an unknown log line is part of the attack
        if(!logLine.detected) {
          currentAttack.push(logLine);
          continue;
        }
        // If it includes battle slots or not battle tag the battle ends here immediately
        if(logLine.tags.includes(LineTag.battleSlots) || !logLine.tags.includes(LineTag.battle)) {
          inBattleResultPhase = false;
          currentAttack = null;
          continue;
        }
        // if there's a weapon shot result this might be the end but there could be more weapon shot results following
        if(logLine.tags.includes(LineTag.weaponShotResult)) {
          inBattleResultPhase = true;
          currentAttack.push(logLine);
          /**
           * @type {LogLine}
           */
          const nextLine = this.#parsedLines[index + 1];
          if(typeof nextLine === "undefined") {
            currentAttack = null;
            inBattleResultPhase = false;
            continue;
          }
          // next line is undetected, presume to be still part of the attack so we don't need to end it here
          if(!nextLine.detected) {
            continue;
          }
          
          // is the next line not with a tag that is still part of the weapon shot result?
          if(nextLine.tags.filter(tag => lineTypesThatContinueBattleResultPhase.includes(tag)).length === 0) {
            inBattleResultPhase = false;
            currentAttack = null;
          }
          continue;
        } else if(inBattleResultPhase) {
          currentAttack.push(logLine);
          /**
           * @type {LogLine}
           */
          const nextLine = this.#parsedLines[index + 1];
          if(nextLine.tags.filter(tag => lineTypesThatContinueBattleResultPhase.includes(tag)).length === 0) {
            currentAttack = null;
            inBattleResultPhase = false;
          }
          continue;
        }
        // continue adding to the attack if it's none of the above
        currentAttack.push(logLine);
      }
    }
    return attacks;
  }

  /**
   * Parses one or more log messages
   * @param {String} text The text of one or more log messages including the header copy-pasted from the ingame log page
   * @returns {LogEntry[]} Array of parsed log entries
   */
  static parseLogEntries(text) {
    const parsedLogHeaders = LogHeadParser.parseMessages(text);

    return parsedLogHeaders.map(parsedLogHeader => this.parseLogMessage(parsedLogHeader));
  }

  /**
   * Parses a log message with a pre-parsed header
   * @param {LogMessage} logMessage log message to parse
   * @returns {LogEntry} parsed log entry
   * @see {LogHeadParser.parseMessages} in order to create a log message with a pre-parsed header 
   */
  static parseLogMessage(logMessage) {
    const logEntry = new LogEntry();
    logEntry.#header = logMessage;

    const splitLines = logMessage.messageBody.split("\n");
    logEntry.#parsedLines = splitLines.map(line => LogLine.parse(line));

    return logEntry;
  }
}

export default LogEntry