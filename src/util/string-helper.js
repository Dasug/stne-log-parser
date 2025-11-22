"use strict"

/**
 * @param {string} text multi-line text to check for line numbers in
 * @param {number} index string character index the line number should be calculated for
 * @returns the line number (starting at line 0) of the given position inside the string
 */
function getLineNumber(text, index) {
  const lines = text.substring(0, index).split('\n');
  return lines.length - 1;
}

export {
  getLineNumber
}
