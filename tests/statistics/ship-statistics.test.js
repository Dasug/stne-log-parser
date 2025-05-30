import { describe, expect, test } from '@jest/globals';
import LogHeadParser from '../../src/regex/log-head-parser.js';
import LogDirection from '../../src/enum/log-direction.js';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import ShipStatistics from '../../src/statistics/ship-statistics.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';

describe('ship statistics', () => {
  test("registers ships correctly", () => {
    const shipStatistics = new ShipStatistics;
    const ship1 = new ShipNameAndNccResult;
    ship1.name = "MyFirstShip";
    ship1.ncc = 123456;
    ship1.shipClass = "DY-500";

    const ship2 = new ShipNameOnlyResult;
    ship2.name = "MySecondShip";
    
    shipStatistics.registerShip(ship1);
    shipStatistics.registerShip(ship2);

    expect(shipStatistics.mentionedShips.length).toBe(2);
    
    const firstShipStatistics = shipStatistics.getShipByNcc(123456);
    expect(firstShipStatistics.name).toBe("MyFirstShip");
    expect(firstShipStatistics.ncc).toBe(123456);
    expect(firstShipStatistics.shipClass).toBe("DY-500");
   
    const secondShipStatistics = shipStatistics.getShipByName("MySecondShip");
    expect(secondShipStatistics.name).toBe("MySecondShip");
  });

  test("duplicate registration", () => {
    const shipStatistics = new ShipStatistics;
    const ship1 = new ShipNameAndNccResult;
    ship1.name = "MyFirstShip";
    ship1.ncc = 123456;
    ship1.shipClass = "DY-500";
    
    shipStatistics.registerShip(ship1);
    shipStatistics.registerShip(ship1);

    expect(shipStatistics.mentionedShips.length).toBe(1);
    
    const firstShipStatistics = shipStatistics.getShipByNcc(123456);
    expect(firstShipStatistics.name).toBe("MyFirstShip");
    expect(firstShipStatistics.ncc).toBe(123456);
    expect(firstShipStatistics.shipClass).toBe("DY-500");
  });

  test("update ship registration", () => {
    const shipStatistics = new ShipStatistics;
    const shipNameOnly = new ShipNameOnlyResult;
    shipNameOnly.name = "MyFirstShip";

    const registration = shipStatistics.registerShip(shipNameOnly);
    shipStatistics.updateShipNcc(registration, 123456);

    // did the registration object get updated?
    expect(registration.ncc).toBe(123456);

    // can the ship now be found by NCC and by name?
    expect(shipStatistics.getShipByName("MyFirstShip").ncc).toBe(123456);
    expect(shipStatistics.getShipByNcc(123456).name).toBe("MyFirstShip");
    

    const shipFull = new ShipNameAndNccResult;
    shipFull.name = "MyFirstShip";
    shipFull.ncc = 123456;
    shipFull.shipClass = "DY-500";
    
    shipStatistics.registerShip(shipFull);

    expect(shipStatistics.mentionedShips.length).toBe(1);
    
    const firstShipStatistics = shipStatistics.getShipByNcc(123456);
    expect(firstShipStatistics.name).toBe("MyFirstShip");
    expect(firstShipStatistics.ncc).toBe(123456);
    expect(firstShipStatistics.shipClass).toBe("DY-500");
    expect(registration.shipClass).toBe("DY-500");
  });
});