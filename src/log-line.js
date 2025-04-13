"use strict";

import { lineTypes } from "./line-types.js";
import GenericType from "./line-type/generic-type.js";

class LogLine {
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
    lineTypes.some(/** @param {GenericType} lineType */ lineType => {
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