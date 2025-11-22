import { PlayerNameAndId } from "../regex.index.js";
import GenericPreprocessor from "./generic-preprocessor.js";

/**
 * Fixes character names sometimes having a linebreak between their name and their ID
 * when copying text from the STNE pahge directly.
 * This breaks the line-by-line parsing since it considers both parts separate lines.
 * This preprocesser removes the linebreak.
 */
class PlayerLinebreakFixPreprocessor extends GenericPreprocessor{
  static preprocess(logText) {
    const regexp = PlayerNameAndId.linebreakFixRegex;
    return logText.replaceAll(regexp, ' ');
  }
}

export default PlayerLinebreakFixPreprocessor;
