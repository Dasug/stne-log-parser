import { describe, expect, test } from '@jest/globals';
import ShipNameAndNccResult from '../../src/regex/parse-result/ship-name-and-ncc-result.js';
import PlayerNameAndIdResult from '../../src/regex/parse-result/player-name-and-id-result.js';
import Statistics from '../../src/statistics/statistics.js';
import ShipNameOnlyResult from '../../src/regex/parse-result/ship-name-only-result.js';
import IndividualShipStatistics from '../../src/statistics/individual-ship-statistics.js';
import IndividualPlayerCharacterStatistics from '../../src/statistics/individual-player-character-statistics.js';

describe('statistics', () => {
  test("registers ship and owner correctly", () => {
    const statistics = new Statistics;
    const ship1 = new ShipNameAndNccResult;
    ship1.name = "MyFirstShip";
    ship1.ncc = 123456;
    ship1.shipClass = "DY-500";

    const owner1 = new PlayerNameAndIdResult;
    owner1.name = "[]U.C.W[] Scorga Empire";
    owner1.id = 34108;
    
    statistics.registerShipAndOwner(ship1, owner1);

    expect(statistics.ships.mentionedShips.length).toBe(1);
    
    const firstShipStatistics = statistics.ships.getShipByNcc(123456);
    expect(firstShipStatistics.name).toBe("MyFirstShip");
    expect(firstShipStatistics.ncc).toBe(123456);
    expect(firstShipStatistics.shipClass).toBe("DY-500");
   
    const player = statistics.playerCharacters.getPlayerCharacterById(34108);
    expect(player.name).toBe("[]U.C.W[] Scorga Empire");
    expect(player.id).toBe(34108);
    expect(firstShipStatistics.owner).toBe(player);
    expect(player.ships).toContain(firstShipStatistics);
  });

  test("shorthand register function", () => {
    const statistics = new Statistics;
    const ship1 = new ShipNameAndNccResult;
    ship1.name = "MyFirstShip";
    ship1.ncc = 123456;
    ship1.shipClass = "DY-500";

    const ship2 = new ShipNameOnlyResult;
    ship2.name = "MySecondShip";

    const owner1 = new PlayerNameAndIdResult;
    owner1.name = "[]U.C.W[] Scorga Empire";
    owner1.id = 34108;

    const [
      ship1Stats,
      ship2Stats,
      player1Stats,
      invalidStats,
      nullStats,
    ] = statistics.register(ship1, ship2, owner1, new Array, null);
    expect(ship1Stats).toBeInstanceOf(IndividualShipStatistics);
    expect(ship1Stats.ncc).toBe(123456);
    expect(ship2Stats).toBeInstanceOf(IndividualShipStatistics);
    expect(ship2Stats.name).toBe("MySecondShip");
    expect(player1Stats).toBeInstanceOf(IndividualPlayerCharacterStatistics);
    expect(player1Stats.id).toBe(34108);
    expect(invalidStats).toBeNull();
    expect(nullStats).toBeNull();
  });
});