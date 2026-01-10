import DestroyShipType from "../line-type/destroy-ship-type.js";
import { PlayerNameAndId } from "../regex.index.js";
import GenericPreprocessor from "./generic-preprocessor.js";

/**
 * Fixes ship destruction lines sometimes having linebreaks before the ship owner
 * when copying text from the STNE page directly.
 * This breaks the line-by-line parsing since it considers both parts separate lines.
 * This preprocesser removes the linebreak.
 */
class DestroyShipLinebreakFixPreprocessor extends GenericPreprocessor{
  static preprocess(logText) {
    return DestroyShipType.fixSplitLines(logText);
  }
}

export default DestroyShipLinebreakFixPreprocessor;
