"use strict"

import { lineTypesByName } from "../../line-type.index.js";

function setupLineTypeTable() {
  const table = document.querySelector("#log-line-type-overview");
  const tableBody = document.querySelector("#log-line-type-overview > tbody");
  if(tableBody === null) {
    console.error("[line-types] table not found");
    return;
  }

  const checkedLanguages = table.dataset.checkedLanguages ? JSON.parse(table.dataset.checkedLanguages) : ["de", "en"];
  const langStats = {};
  checkedLanguages.forEach(lang => langStats[lang] = 0);
  let totalAmount = 0;
  
  const newRows = [];
  for (let [lineTypeName, lineType] of Object.entries(lineTypesByName)) {
    // Ignore GenericType since it's not supposed to have an implementation in the first place
    if(lineTypeName === "GenericType") {
      continue;
    }
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.innerText = lineTypeName;
    row.appendChild(nameCell);

    const supportedLanguages = lineType.getSupportedLanguages();
    checkedLanguages.forEach(lang => {
      const langCell = document.createElement("td");
      if(supportedLanguages.includes(lang)) {
        langCell.innerText = "✅";
        langStats[lang]++;
      } else {
        langCell.innerText = "❌";
      }
      row.appendChild(langCell);
    });
    newRows.push(row);
    totalAmount++;
  }
  tableBody.replaceChildren(...newRows);

  // statistics
  Array.from(document.querySelectorAll(".log-line-total")).forEach(element => element.innerText = totalAmount);
  Array.from(document.querySelectorAll(".lang-log-line-total")).forEach(element => {
    const lang = element.dataset.lang;
    element.innerText = langStats[lang] ?? "-";
  });
}

export {setupLineTypeTable};
