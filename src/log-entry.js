"use strict";

import LogDirection from "./enum/log-direction.js";
import LogLine from "./log-line.js";
import LogHeadParser from "./regex/log-head-parser.js";
import LogMessage from "./regex/parse-result/log-message.js";
import PlayerNameAndId from "./regex/subroutine/player-name-and-id.js";

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