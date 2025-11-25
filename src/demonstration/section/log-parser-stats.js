"use strict"

import LogEntry from "../../log-entry.js"
import { Statistics } from "../../statistics.index.js";

/**
 * builds the log statistics object given by the library
 * @param {LogEntry[]} logEntries 
 */
function buildStatistics(logEntries) {
  const statsObject = new Statistics;

  logEntries.forEach(logEntry => logEntry.populateStatistics(statsObject));
  return statsObject;
}

function sortStatisticsTable(table, columnIndex, ascending) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  rows.sort((a, b) => {
    const aValue = a.cells[columnIndex].getAttribute('data-sort-value');
    const bValue = b.cells[columnIndex].getAttribute('data-sort-value');
    
    // check if sort value is numeric
    const aIsNumeric = !isNaN(aValue) && !isNaN(parseFloat(aValue));
    const bIsNumeric = !isNaN(bValue) && !isNaN(parseFloat(bValue));
    
    let comparison = 0;
    
    if (aIsNumeric && bIsNumeric) {
      // Both numeric - compare as numbers
      comparison = parseFloat(aValue) - parseFloat(bValue);
    } else if (aIsNumeric && !bIsNumeric) {
      // Numeric comes first in ascending, last in descending
      comparison = ascending ? -1 : 1;
    } else if (!aIsNumeric && bIsNumeric) {
      // Numeric comes first in ascending, last in descending
      comparison = ascending ? 1 : -1;
    } else {
      // Both strings - compare as strings
      comparison = aValue.localeCompare(bValue);
    }
    
    return ascending ? comparison : -comparison;
  });
  
  rows.forEach(row => tbody.appendChild(row));
}

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

function updateShipStatisticsTable(libraryStatistics) {
  const statsMentionedShipsTableBody = document.querySelector("#stats-mentioned-ships-table > tbody");
  const newShipsTableRows = [];
  libraryStatistics.ships.mentionedShips.forEach(ship => {
    const tableRow = document.createElement("tr");
    newShipsTableRows.push(tableRow);

    const shipNameCell = document.createElement("td");
    tableRow.appendChild(shipNameCell);
    const shipNccDisplay = ship.nccPrefix ? (ship.nccPrefix + "-") : "";
    const shipClassDisplay = ship.shipClass ? (", " + ship.shipClass) : "";
    let shipNameString;
    if(ship.ncc !== null) {
      shipNameString = `${ship.name} (${shipNccDisplay}${ship.ncc}${shipClassDisplay})`;
    } else {
      shipNameString = ship.name;
    }
    if(ship.isDestroyed) {
      shipNameString += " †";
    }
    shipNameCell.innerText = shipNameString;
    shipNameCell.dataset.sortValue = ship.ncc ?? ship.name;

    const shipOwnerCell = document.createElement("td");
    tableRow.appendChild(shipOwnerCell);
    let ownerNameString;
    if(ship.owner && ship.owner.name === null && ship.owner.id !== null) {
      ownerNameString = ship.owner.id;
    } else if(ship.owner && ship.owner.name !== null) {
      ownerNameString = ship.owner.name;
      if(ship.owner.id !== null) {
        const ownerIdDisplay = ` (${ship.owner.idPrefix ? (ship.owner.idPrefix + "-") : ""}${ship.owner.id})`;
        ownerNameString += ownerIdDisplay;
      }
    } else {
      ownerNameString = "?";
    }
    shipOwnerCell.innerText = ownerNameString;
    shipOwnerCell.dataset.sortValue = ship.owner.id ?? ship.owner.name;
    
    const damageDealtCell = document.createElement("td");
    tableRow.appendChild(damageDealtCell);
    let damageDealtText = ship.effectiveDamageDealt;
    if(ship.overkillDamageDealt > 0) {
      damageDealtText += ` (+${ship.overkillDamageDealt})`;
    }
    damageDealtCell.innerText = damageDealtText;
    damageDealtCell.dataset.sortValue = ship.totalDamageDealt;
    
    const damageTakenCell = document.createElement("td");
    tableRow.appendChild(damageTakenCell);
    let damageTakenText = ship.shieldDamageReceived + ship.hullDamageReceived;
    if(ship.overkillDamageReceived > 0) {
      damageTakenText += ` (+${ship.overkillDamageReceived})`;
    }
    damageTakenCell.innerText = damageTakenText;
    damageTakenCell.dataset.sortValue = ship.shieldDamageReceived + ship.hullDamageReceived + ship.overkillDamageReceived;

    const hitRateCell = document.createElement("td");
    tableRow.appendChild(hitRateCell);
    const shotsFired = ship.shotsFired;
    if(shotsFired.length > 0) {
      const shotsHitNumber = shotsFired.filter(shot => shot.shotHasHit).length;
      hitRateCell.innerText = (Math.round(10000 * shotsHitNumber / shotsFired.length) / 100) + "%";
      hitRateCell.dataset.sortValue = shotsHitNumber / shotsFired.length;
    } else {
      hitRateCell.innerText = "-";
      hitRateCell.dataset.sortValue = Number.MIN_SAFE_INTEGER;
    }

    const dodgeRateCell = document.createElement("td");
    tableRow.appendChild(dodgeRateCell);
    const shotsReceived = ship.shotsReceived;
    if(shotsReceived.length > 0) {
      const shotsDodgedNumber = shotsReceived.length - shotsReceived.filter(shot => shot.shotHasHit).length;
      dodgeRateCell.innerText = (Math.round(10000 * shotsDodgedNumber / shotsReceived.length) / 100) + "%";
      dodgeRateCell.dataset.sortValue = shotsDodgedNumber / shotsReceived.length;
    } else {
      dodgeRateCell.innerText = "-";
      dodgeRateCell.dataset.sortValue = Number.MIN_SAFE_INTEGER;
    }
  });
  statsMentionedShipsTableBody.replaceChildren(...newShipsTableRows);
}

function updateStatistics(logEntries) {
  const logStatistics = buildLogStatistics(logEntries);
  const statValueFields = Array.from(document.querySelectorAll(".stat-value[data-stats-key]"));
  statValueFields.forEach(field => {
    if(field.dataset.statsKey && typeof logStatistics[field.dataset.statsKey] !== "undefined") {
      field.style.setProperty("--stat-num", logStatistics[field.dataset.statsKey]);
    }
  });

  const libraryStatistics = buildStatistics(logEntries);
  updateShipStatisticsTable(libraryStatistics);
}

function setupStatsSection() {
  const headers = document.querySelectorAll('#log-statistics th[data-sortable="true"]');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const table = header.closest('table');
      const columnIndex = Array.from(header.parentNode.children).indexOf(header);
      const isAscending = header.classList.contains('asc');
      
      // Remove sorting classes from all headers
      headers.forEach(h => h.classList.remove('asc', 'desc'));
      
      // Toggle sort direction
      if (isAscending) {
        header.classList.add('desc');
        sortStatisticsTable(table, columnIndex, false);
      } else {
        header.classList.add('asc');
        sortStatisticsTable(table, columnIndex, true);
      }
    });
  });
}

export {updateStatistics, setupStatsSection};
