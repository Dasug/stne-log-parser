"use strict";

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
   * Returns all tags that match this type of log line
   * This information is used to detect the type of the entire log entry
   * @returns array of tags
   */
  static getTags() {
    return [
      "generic"
    ];
  }
}

export default GenericType;