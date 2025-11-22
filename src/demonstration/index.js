import * as index from '../index.js';
import { setupLineTypeTable } from './section/line-types.js';

function initialize() {
  // expose parser to window object
  window.stneLogParser = index;
  setupLineTypeTable();
}

export default initialize;
