"use strict"

import LogEntry from "../../log-entry.js"

/**
 * build statistics about the parsed log entires and lines
 * @param {LogEntry[]} logEntries 
 */
function buildLogStatistics(logEntries) {
  return {
    totalLogEntries: logEntries?.length ?? 0,
    totalLogLines: logEntries?.reduce((accumulator, entry) => accumulator + entry.parsedLines.length, 0) ?? 0,
    parsedLogLines: logEntries?.reduce(
      (accumulator, entry) => accumulator + entry.parsedLines.filter(l => l.detected).length, 0
    ) ?? 0,
    unparsedLogLines: logEntries?.reduce(
      (accumulator, entry) => accumulator + entry.parsedLines.filter(l => !l.detected).length, 0
    ) ?? 0,
  }
}

function updateStatistics(logEntries) {
  const logStatistics = buildLogStatistics(logEntries);
  const statValueFields = Array.from(document.querySelectorAll(".stat-value[data-stats-key]"));
  statValueFields.forEach(field => {
    if(field.dataset.statsKey && typeof logStatistics[field.dataset.statsKey] !== "undefined") {
      field.style.setProperty("--stat-num", logStatistics[field.dataset.statsKey]);
    }
  });
}

export {updateStatistics};
