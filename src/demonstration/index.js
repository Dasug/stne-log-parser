import * as index from '../index.js';
import { setupLineTypeTable } from './section/line-types.js';
import { setupStatsSection } from './section/log-parser-stats.js';
import { setupLogParser } from './section/log-parser.js';

function initialize() {
  // expose parser to window object
  window.stneLogParser = index;
  setupLineTypeTable();
  setupLogParser();
  setupStatsSection();
}

export default initialize;
