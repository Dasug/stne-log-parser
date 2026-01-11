"use strict"

import LogEntry from '../../log-entry.js';
import LogHeadParser from '../../regex/log-head-parser.js';
import DisplayableRegexResult from '../../regex/parse-result/displayable-regex-result.js';
import { updateStatistics } from './log-parser-stats.js';

function setupLogParser() {
  const input = document.querySelector("#log-parser-input");
  input.addEventListener("input", () => handleInput(input, input.innerText));
}

function jumpToLogLine(lineDiv) {
  lineDiv.scrollIntoView({
    "behavior": "auto",
    "block": "center",
    "container": "all",
    "inline": "start",
  });
  lineDiv.classList.add("highlighted");
  setTimeout(() => lineDiv.classList.remove("highlighted"), 3000);
}

function processLogEntry(logEntryInputField, unknownLogLineContainer, workQueue) {
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
      lineDiv.classList.add("tooltip");

      if(parsedLine.detected) {
        lineDiv.dataset.tooltipContent = String.raw`Line Type: ${parsedLine.lineParser.name}`;
        for(const [key, value] of Object.entries(parsedLine.parseResult)) {
          lineDiv.dataset.tooltipContent += "\n";
          if(value instanceof DisplayableRegexResult) {
            lineDiv.dataset.tooltipContent += `${key}: ${value.asDisplayString()}`;
          } else if(typeof value === "object") {
            lineDiv.dataset.tooltipContent += `${key}: ${JSON.stringify(value)}`;
          } else {
            lineDiv.dataset.tooltipContent += `${key}: ${value}`;
          }
        }
        lineDiv.classList.add("log-line-parsed");
      } else {
        lineDiv.dataset.tooltipContent = "Line could not be parsed.";
        lineDiv.classList.add("log-line-not-parsed");
        const lineDivClone = lineDiv.cloneNode(true);
        lineDivClone.classList.add("log-line-jump");
        lineDivClone.addEventListener("click", () => jumpToLogLine(lineDiv));
        unknownLogLineContainer.appendChild(lineDivClone);
      }
    }

    entryDiv.replaceChildren(...headerLineDivs, ...newLineDivs);
  }

  updateStatistics(logEntryInputField.parsedEntries);

  // go to the next item when done.
  window.setTimeout(() => processLogEntry(logEntryInputField, unknownLogLineContainer, workQueue), 100);
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

  const unknownLogLineContainer = document.querySelector("#unknown-log-lines");
  unknownLogLineContainer.replaceChildren();

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
    processLogEntry(inputField, unknownLogLineContainer, workQueue);
  }, 100);
}

export {setupLogParser};
