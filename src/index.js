import StneLogParser from "./stne-log-parser.js";
import LogEntry from "./log-entry.js";
import LogLine from "./log-line.js";

function requireAll(r) { return r.keys().map(k => r(k)); }
const lineTypeContext = import.meta.webpackContext('./line-type/',
  {
    recursive: false,
    regExp: /-type\.js$/
  }
);
const lineTypesImports = requireAll(lineTypeContext);
const lineTypes = lineTypesImports.map(type => type.default);

export { StneLogParser as default, StneLogParser, LogEntry, LogLine, lineTypes };