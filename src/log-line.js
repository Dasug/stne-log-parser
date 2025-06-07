"use strict";

import { lineTypes } from "./line-type.index.js";
import GenericType from "./line-type/generic-type.js";
import LineTag from "./enum/line-tag.js";
import Statistics from "./statistics/statistics.js";

class LogLine {
  static #logLineTypes = lineTypes;

  #language = null;
  #detected = false;
  #line = "";
  #parseResult = null;
  #lineParser = null;

  /**
   * true if the log line was successfully detected by a parser
   * @returns {boolean}
   */
  get detected() { return this.#detected; }

  /** 
   * the log line that was passed to the parser
   * @returns {string}
  */
  get line() { return this.#line; }

  /**
   * the parsed result of the log line, only available after parsing was successful
   * @returns {?object}
   */
  get parseResult() { return this.#parseResult; }

  /**
   * the language of the log line, only available after parsing was successful
   * @returns {?string}
   */
  get language() { return this.#language; }

  /**
   * parser class that detected and parsed the log line
   * @returns {?GenericType}
   */
  get lineParser() { return this.#lineParser; }

  /**
   * the tags of the parsed log line type, only available after parsing was successful
   * @returns {LineTag[]}
   */
  get tags() { return this.#lineParser?.getTags() ?? []; }

  /**
   * get the log line types that are loaded
   * @returns {GenericType[]}
   */
  static get lineTypes() {
    return this.#logLineTypes;
  }

  /**
   * Overrides the log line types to use for parsing the log lines.
   * Use this method if you want to use log parsing in a test
   * as jest cannot load them in the usual way and you normally
   * won't need all of them anyways for testing.
   * @param {GenericType[]} lineTypes line types to use
   */
  static overrideLogLineTypes(lineTypes) {
    this.#logLineTypes = lineTypes;
  }

  /**
   * Resets the log line types to the default ones provided by line-type.index.js.
   * This is usually all of them or none of them if using the jest mock.
   * @returns {void}
   */
  static resetLogLineTypes() {
    this.#logLineTypes = lineTypes;
  }

  /**
   * populates the given statistics object with this log line's data
   * @param {Statistics} statistics statistics object
   * @returns {Statistics} statistics object populated with this log line's data
   */
  populateStatistics(statistics) {
    if(this.lineParser === null) {
      return statistics;
    }

    this.lineParser.populateStatistics(statistics, this.parseResult);
    return statistics;
  }

  /**
   * Parse a given log line
   * 
   * Note: This method will run through the parsers synchronously. This can cause performance issues.
   * @param {string} [line] log line to be parsed
   * @param {string} [language] language of the log line, test for any supported language if not specified
   * @returns {LogLine} parsed log line
   */
  static parse(line, language = null) {
    const trimmedLine = (typeof line === "string")? line.trim() : "";
    let parsedLine = null;
    let detectedLanguage = null;
    let detectedLineType = null;
    this.#logLineTypes.some(/** @param {GenericType} lineType */ lineType => {
      let checkedLanguages = [];
      if(language === null) {
        checkedLanguages = lineType.getSupportedLanguages();
      } else {
        checkedLanguages = [ language ];
      }
      return checkedLanguages.some(lang => {
        if(lineType.detect(trimmedLine, lang)) {
          detectedLanguage = lang;
          parsedLine = lineType.parse(trimmedLine, lang);
          detectedLineType = lineType;

          return true;
        }
      });
    });

    const logLine = new LogLine();
    logLine.#line = trimmedLine;
    if(parsedLine !== null) {
      logLine.#parseResult = parsedLine;
      logLine.#language = detectedLanguage;
      logLine.#detected = true;
      logLine.#lineParser = detectedLineType;
    }

    return logLine;
  }

}

export default LogLine;