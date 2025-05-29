"use strict";

import LineTag from "../../src/enum/line-tag.js";
import Statistics from "../statistics/statistics.js";

class GenericType {
  static _regexByLanguage = {};
  /**
   * checks if log line matches this line type
   * @param {string} text text to be detected
   * @param {string} language language that the log line is in
   * @returns true if given log line matches with this log type, otherwise false
   */
  static detect(text, language) {
    if (typeof this._regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return false;
    }
    // no text was given, return no valid match
    if(typeof text === "undefined" || text === null) {
      return null;
    }
    return String(text).match(this._regexByLanguage[language]) !== null;
  }

  /**
   * parses the log line and returns fitting parse result object
   * @param {string} text log line text to be parsed
   * @param {string} language language that the log line is in
   * @returns object parsed object
   */
  static parse(text, language) {
    if (typeof this._regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return null;
    }
    // no text was given, return no valid match
    if(typeof text === "undefined" || text === null) {
      return null;
    }
    const matches = String(text).match(this._regexByLanguage[language]);

    if(matches === null) {
      return null;
    }

    return this._buildResultObject(matches);
  }

  /**
   * internal function to build the parse result object from regex matches
   * @param {object} matches regex matches
   * @returns parse result object depending on type
   */
  static _buildResultObject(matches) {
    return {};
  }

  /**
   * Returns all languages that are supported by this line type
   * @returns {string[]}
   */
  static getSupportedLanguages() {
    if(typeof this._regexByLanguage !== "object") {
      return [];
    }
    return Object.keys(this._regexByLanguage);
  }

  /**
   * Returns all tags that match this type of log line
   * This information is used to detect the type of the entire log entry
   * @returns {LineTag[]}
   */
  static getTags() {
    return [
      LineTag.generic,
    ];
  }

  /**
   * 
   * @param {Statistics} statistics statistics object
   * @param {Object} parseResult parse result object obtained from parse method
   * @returns {Statistics} statistics object extended to include statistics for this log line
   */
  static populateStatistics(statistics, parseResult) {
    // stub, needs to be extended in implementations
    return statistics;
  }
}

export default GenericType;