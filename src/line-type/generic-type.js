"use strict";

import LineTag from "./tags/line-tag";

class GenericType {
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
  static parse(text, language) {
    // nothing to return
    return {}
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