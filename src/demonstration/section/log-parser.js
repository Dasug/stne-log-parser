"use strict"

import LogHeadParser from '../../regex/log-head-parser.js';

function setupLogParser() {
  const input = document.querySelector("#parser .log-entry");
  input.addEventListener("input", () => handleInput(input, input.innerText));
}

function handleInput(inputField, inputContent) {
  const lines = inputContent.split("\n");
  const logEntries = LogHeadParser.parseMessages(inputContent);
  const logElements = [];
  let currentEntry = null;
  let currentEntryDiv = null;
  const lastEntryLine = logEntries.reduce((acc, entry) => Math.max(acc, entry.lineEnd), 0);

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    if(lineNum > lastEntryLine) {
      currentEntry = null;
      currentEntryDiv = null;
    } else {
      logEntries.forEach(entry => {
        if(lineNum >= entry.lineStart && lineNum <= entry.lineEnd && currentEntry !== entry) {
          currentEntry = entry;
          currentEntryDiv = document.createElement("div");
          currentEntryDiv.classList.add("log-entry-boundary");
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
}

export {setupLogParser};
