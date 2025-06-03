import { describe, expect, test } from '@jest/globals';
import ColonyStatistics from '../../src/statistics/colony-statistics.js';
import ColonyNameAndIdResult from '../../src/regex/parse-result/colony-name-and-id-result.js';
import IndividualColonyStatistics from '../../src/statistics/individual-colony-statistics.js';

describe('colony statistics', () => {
  test("registers colony correctly", () => {
    const colonyStatistics = new ColonyStatistics;
    const colony1 = new ColonyNameAndIdResult;
    colony1.id = 23307;
    colony1.name = "[Kingdom] Koweston";
    
    const colony2 = new ColonyNameAndIdResult;
    colony2.id = 25639;
    colony2.name = "[Kingdom] Dragowan";

    
    colonyStatistics.registerColony(colony1);
    colonyStatistics.registerColony(colony2);

    expect(colonyStatistics.mentionedColonies.length).toBe(2);
    
    const firstColonyStatistics = colonyStatistics.getColonyById(23307);
    expect(firstColonyStatistics).toBeInstanceOf(IndividualColonyStatistics);
    expect(firstColonyStatistics.name).toBe("[Kingdom] Koweston");
    expect(firstColonyStatistics.id).toBe(23307);
   
    const secondColonyStatistics = colonyStatistics.getColonyByName("[Kingdom] Dragowan");
    expect(secondColonyStatistics).toBeInstanceOf(IndividualColonyStatistics);
    expect(secondColonyStatistics.name).toBe("[Kingdom] Dragowan");
    expect(secondColonyStatistics.id).toBe(25639);
  });

  test("duplicate registration", () => {
    const colonyStatistics = new ColonyStatistics;
    const colony1 = new ColonyNameAndIdResult;
    colony1.id = 23307;
    colony1.name = "[Kingdom] Koweston";
    
    colonyStatistics.registerColony(colony1);
    colonyStatistics.registerColony(colony1);

    expect(colonyStatistics.mentionedColonies.length).toBe(1);
    
    const firstColonyStatistics = colonyStatistics.getColonyById(23307);
    expect(firstColonyStatistics).toBeInstanceOf(IndividualColonyStatistics);
    expect(firstColonyStatistics.name).toBe("[Kingdom] Koweston");
    expect(firstColonyStatistics.id).toBe(23307);
  });

});