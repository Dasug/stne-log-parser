"use strict"

import LogEntry from "../../log-entry.js"
import { Statistics } from "../../statistics.index.js";
import AggregateShipStatistics from "../../statistics/aggregate-ship-statistics.js";

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

function buildStatsTableBody(table, statsRows) {
  const tableBody = table.querySelector("& > tbody");
  const template = document.querySelector(table.dataset.rowTemplate);
  if(template === null) {
    console.error("no row template found for table", table);
    return;
  }

  const newTableRows = [];
  statsRows.forEach(statsRow => {
    const row = template.content.cloneNode(true);
    newTableRows.push(row);

    for (let [key, statsItem] of Object.entries(statsRow)) {
      const cell = row.querySelector(`td[data-key="${key}"]`);
      if(cell === null) {
        continue;
      }
      cell.innerText = statsItem.value ?? "";
      cell.dataset.sortValue = statsItem.sortValue ?? 0;
    };
  });

  tableBody.replaceChildren(...newTableRows);
}

function makeShipNameCellData(ship) {
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
  const shipNameSortValue = ship.ncc ?? ship.name;
  return {
    value: shipNameString,
    sortValue: shipNameSortValue
  };
}

function makeShipClassCellData(ship) {
  return {
    value: ship.shipClass,
    sortValue: ship.shipClass
  };
}

function makeShipClassNumberCellData(ship) {
  return {
    value: ship.number ?? 1,
    sortValue: ship.number ?? 1
  };
}

function makeOwnerCellData(ship) {
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
  const shipOwnerSortValue = ship.owner?.id ?? ship.owner?.name ?? "";
  return {
    value: ownerNameString,
    sortValue: shipOwnerSortValue
  }
}

function makeDamageDealtCellData(ship) {
  let damageDealtText = ship.effectiveDamageDealt;
  if(ship.overkillDamageDealt > 0) {
    damageDealtText += ` (+${ship.overkillDamageDealt})`;
  }
  const damageDealtSortValue = ship.totalDamageDealt;
  return {
    value: damageDealtText,
    sortValue: damageDealtSortValue
  };
}

function makeDamageTakenCellData(ship) {
  let damageTakenText = ship.shieldDamageReceived + ship.hullDamageReceived;
  if(ship.overkillDamageReceived > 0) {
    damageTakenText += ` (+${ship.overkillDamageReceived})`;
  }
  const damageTakenSortValue = ship.shieldDamageReceived + ship.hullDamageReceived + ship.overkillDamageReceived;
  return {
    value: damageTakenText,
    sortValue: damageTakenSortValue
  };
}

function makeHitRateCellData(ship) {
  const hitRate = ship.hitRate;
  let hitRateText;
  let hitRateSortValue;
  if(hitRate !== null) {
    hitRateText = (Math.round(10000 * hitRate) / 100) + "%";
    hitRateSortValue = hitRate;
  } else {
    hitRateText = "-";
    hitRateSortValue = Number.MIN_SAFE_INTEGER;
  }
  return {
    value: hitRateText,
    sortValue: hitRateSortValue
  };
}

function makeDodgeRateCellData(ship) {
  const shotsReceived = ship.shotsReceived;
  let dodgeRateText;
  let dodgeRateSortValue;
  if(shotsReceived.length > 0) {
    const shotsDodgedNumber = shotsReceived.length - shotsReceived.filter(shot => shot.shotHasHit).length;
    dodgeRateText = (Math.round(10000 * shotsDodgedNumber / shotsReceived.length) / 100) + "%";
    dodgeRateSortValue = shotsDodgedNumber / shotsReceived.length;
  } else {
    dodgeRateText = "-";
    dodgeRateSortValue = Number.MIN_SAFE_INTEGER;
  }
  return {
    value: dodgeRateText,
    sortValue: dodgeRateSortValue
  };
}

function updateShipStatisticsTable(libraryStatistics) {
  const statsMentionedShipsTableBody = document.querySelector("#stats-mentioned-ships-table");
  const statsTableContents = [];
  libraryStatistics.ships.mentionedShips.forEach(ship => {
    const statsTableRow = {};
    statsTableRow.ship = makeShipNameCellData(ship);
    statsTableRow.owner = makeOwnerCellData(ship);
    statsTableRow.damageDealt = makeDamageDealtCellData(ship);
    statsTableRow.damageTaken = makeDamageTakenCellData(ship);
    statsTableRow.hitRate = makeHitRateCellData(ship);
    statsTableRow.dodgeRate = makeDodgeRateCellData(ship);

    statsTableContents.push(statsTableRow);
  });

  buildStatsTableBody(statsMentionedShipsTableBody, statsTableContents);
  
  const aggregateByPlayer = AggregateShipStatistics.aggregateByPlayer(libraryStatistics.ships.mentionedShips);

  const aggregateStatsTableContents = [];
  for(const aggregateShip of Object.values(aggregateByPlayer)) {
    const statsTableRow = {};
    statsTableRow.owner = makeOwnerCellData(aggregateShip);
    statsTableRow.damageDealt = makeDamageDealtCellData(aggregateShip);
    statsTableRow.damageTaken = makeDamageTakenCellData(aggregateShip);
    statsTableRow.hitRate = makeHitRateCellData(aggregateShip);
    statsTableRow.dodgeRate = makeDodgeRateCellData(aggregateShip);

    aggregateStatsTableContents.push(statsTableRow);
  };

  const statsAggregatedShipsByPlayerTableBody = document.querySelector("#stats-aggregated-ships-by-player-table");
  buildStatsTableBody(statsAggregatedShipsByPlayerTableBody, aggregateStatsTableContents);
  
  const aggregateByPlayerAndClass = AggregateShipStatistics.aggregateByPlayerAndShipClass(libraryStatistics.ships.mentionedShips);

  const aggregateClassStatsTableContents = [];
  for(const aggregateShipClasses of Object.values(aggregateByPlayerAndClass)) {
    for(const aggregateShip of Object.values(aggregateShipClasses)) {
      const statsTableRow = {};
      statsTableRow.owner = makeOwnerCellData(aggregateShip);
      statsTableRow.shipClass = makeShipClassCellData(aggregateShip);
      statsTableRow.number = makeShipClassNumberCellData(aggregateShip);
      statsTableRow.damageDealt = makeDamageDealtCellData(aggregateShip);
      statsTableRow.damageTaken = makeDamageTakenCellData(aggregateShip);
      statsTableRow.hitRate = makeHitRateCellData(aggregateShip);
      statsTableRow.dodgeRate = makeDodgeRateCellData(aggregateShip);

      aggregateClassStatsTableContents.push(statsTableRow);
    }
  };

  const statsAggregatedShipsByPlayerAndClassTableBody = document.querySelector("#stats-aggregated-ships-by-player-and-class-table");
  buildStatsTableBody(statsAggregatedShipsByPlayerAndClassTableBody, aggregateClassStatsTableContents);
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
