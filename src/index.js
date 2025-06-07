import LogLine from "./log-line.js";
import { lineTypes, lineTypesByName, lineTypeParseResults, lineTypeParseResultsByName } from "./line-type.index.js";
import * as regexHelper from './util/regex-helper.js';

const util = {
  regexHelper,
}

export { default as default, default as StneLogParser } from "./stne-log-parser.js";
export { default as LogEntry } from "./log-entry.js";
export {
  // for some reason this has to be exported this way, otherwise 
  LogLine,

  // line type auto-bundled objects
  lineTypes,
  lineTypesByName,
  lineTypeParseResults,
  lineTypeParseResultsByName,
  
  util,
};

// Enums
export * as enum from "./enum.index.js";

// Statistics
export * as statistics from "./statistics.index.js";

// Regex
export * as regex from "./regex.index.js";