"use strict"

import LogEntry from '../../log-entry.js';
import LogHeadParser from '../../regex/log-head-parser.js';
import { updateStatistics } from './log-parser-stats.js';

function setupLogParser() {
  const input = document.querySelector("#parser .log-entry");
  input.addEventListener("input", () => handleInput(input, input.innerText));
}

function processLogEntry(logEntryInputField, workQueue) {
  if(workQueue.length === 0) {
    updateStatistics(logEntryInputField.parsedEntries);
    return;
  }
  const work = workQueue.pop();
  const entry = work.entry;
  const entryDiv = work.entryDiv;
  let parsedEntry = null;
  try {
    LogEntry.preprocessLogMessage(entry);
    parsedEntry = LogEntry.parseLogMessage(entry);
  } catch(e) {
    console.error("could not parse log entry", {entry, e});
  }

  
  if(parsedEntry !== null) {
    logEntryInputField.parsedEntries.push(parsedEntry);
    const parsedLines = parsedEntry.parsedLines;
    const headerLineDivs = Array.from(entryDiv.querySelectorAll(".log-line.log-header"));
    const newLineDivs = [];
    for (let index = 0; index < parsedLines.length; index++) {
      const lineDiv = document.createElement("div");
      lineDiv.classList.add("log-line");
      newLineDivs.push(lineDiv);
      const parsedLine = parsedLines[index] ?? null;
      lineDiv.innerText = parsedLine.line;
      
      if(parsedLine.detected) {
        lineDiv.classList.add("log-line-parsed");
      } else {
        lineDiv.classList.add("log-line-not-parsed");
      }
    }

    entryDiv.replaceChildren(...headerLineDivs, ...newLineDivs);
  }

  updateStatistics(logEntryInputField.parsedEntries);

  // go to the next item when done.
  window.setTimeout(() => processLogEntry(logEntryInputField, workQueue), 100);
}

function handleInput(inputField, inputContent) {
  // prepare log entry dataset
  inputField.parsedEntries = [];
  const lines = inputContent.split("\n");
  const logEntries = LogHeadParser.parseMessages(inputContent);
  const logElements = [];
  let currentEntry = null;
  let currentEntryDiv = null;
  const lastEntryLine = logEntries.reduce((acc, entry) => Math.max(acc, entry.lineEnd), 0);
  const entryDivs = [];

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    if(lineNum > lastEntryLine) {
      currentEntry = null;
      currentEntryDiv = null;
    } else {
      logEntries.forEach((entry, idx) => {
        if(lineNum >= entry.lineStart && lineNum <= entry.lineEnd && currentEntry !== entry) {
          currentEntry = entry;
          currentEntryDiv = document.createElement("div");
          currentEntryDiv.classList.add("log-entry-boundary");
          entryDivs[idx] = currentEntryDiv;
          logElements.push(currentEntryDiv);
        }
      });
    }

    const lineDiv = document.createElement("div");
    lineDiv.classList.add("log-line");
    lineDiv.innerText = line;
    if(currentEntryDiv === null) {
      logElements.push(lineDiv);
    } else {
      if(lineNum >= currentEntry.lineStart + currentEntry.messageBodyLineStartOffset) {
        lineDiv.classList.add("log-line-pending");
      } else {
        lineDiv.classList.add("log-header");
      }
      currentEntryDiv.appendChild(lineDiv);
    }
  }
  inputField.replaceChildren(...logElements)

  const workQueue = [...logEntries].map((entry, idx) => {
    return {
      entry: entry,
      entryDiv: entryDivs[idx],
    };
  }).sort((a,b) => (a.entry.dateTime - b.entry.dateTime));
  window.setTimeout(() => {
    processLogEntry(inputField, workQueue);
  }, 100);
}

export {setupLogParser};
