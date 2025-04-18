"use strict"

import {regex, pattern} from 'regex';

class Expression {
  static regexPattern = pattern`` // empty pattern for this parent class

  /**
   * Returns the expression pattern for use in a regex subroutine definition
   * @returns pattern
   */
  static asSubroutineDefinition() {
    return this.regexPattern;
  }

  /**
   * Matches the given text with the expression and returns matches
   * @param {string} text 
   * @returns array of matches
   */
  static match(text) {
    if(typeof text === "undefined" || text === null) {
      return null;
    }
    return String(text).match(regex`^${this.regexPattern}$`);
  }

  /**
   * Matches the given text with the expression and returns matching result class
   * @param {string} text 
   * @returns {?object} result object or null if there was no match
   */
  static matchResult(text) {
    return null;
  }
}

export default Expression;