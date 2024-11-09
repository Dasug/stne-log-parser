"use strict";

import LineTag from "./tags/line-tag.js";

class GenericType {
  static _regexByLanguage = {}
  /**
   * checks if log line matches this line type
   * @param {string} text text to be detected
   * @param {string} language language that the log line is in
   * @returns true if given log line matches with this log type, otherwise false
   */
  static detect(text, language) {
    // always return false as no line should be detected as generic type
    return false;
  }

  /**
   * parses the log line and returns fitting parse result object
   * @param {string} text log line text to be parsed
   * @param {string} language language that the log line is in
   * @returns object parsed object
   */
  static detect(text, language) {
    if (typeof this._regexByLanguage[language] === "undefined") {
      // language not supported for this type
      return false;
    }
    return text.match(this._regexByLanguage[language]) !== null;
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
}

export default GenericType;