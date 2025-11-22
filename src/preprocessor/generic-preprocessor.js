/**
 * Generic preprocessor to define the preprocessor interface and for other pre-processor to extend from. Does nothing on it's own.
 */
class GenericPreprocessor {
  /**
   * The execution priority of the preprocessor. Only needs to be overwritten when priority matters.  
   * A lower number means earlier execution. Since the default is 0, use positive numbers for
   * preprocessors that should run later than the non-specific ones and negative numbers for
   * preprocessors that are supposed to run earlier. 
   */
  static get priority() {
    return 0;
  }
  
  /**
   * Pre-processes multi-line log text for things that need to be adjusted before line by line parsing
   * @param {string} logText multi-line log text to be pre-processed
   * @returns preprocessed text
   */
  static preprocess(logText) {
    return logText;
  }
}

export default GenericPreprocessor;
