import { describe, expect, test } from '@jest/globals';
import PlayerCharacterStatistics from '../../src/statistics/player-character-statistics.js';
import PlayerNameAndIdResult from '../../src/regex/parse-result/player-name-and-id-result.js';
import IndividualPlayerCharacterStatistics from '../../src/statistics/individual-player-character-statistics.js';

describe('player character statistics', () => {
  test("registers player characters correctly", () => {
    const playerCharacterStatistics = new PlayerCharacterStatistics;
    const player1 = new PlayerNameAndIdResult;
    player1.id = 34108;
    player1.name = "[]U.C.W[] Scorga Empire";

    const player2 = new PlayerNameAndIdResult;
    player2.id = 6;
    player2.name = "Romulaner";
    player2.idPrefix = "NPC";

    
    playerCharacterStatistics.registerPlayerCharacter(player1);
    playerCharacterStatistics.registerPlayerCharacter(player2);

    expect(playerCharacterStatistics.mentionedPlayerCharacters.length).toBe(2);
    
    const firstPlayerCharacterStatistics = playerCharacterStatistics.getPlayerCharacterById(34108);
    expect(firstPlayerCharacterStatistics).toBeInstanceOf(IndividualPlayerCharacterStatistics);
    expect(firstPlayerCharacterStatistics.name).toBe("[]U.C.W[] Scorga Empire");
    expect(firstPlayerCharacterStatistics.id).toBe(34108);
    expect(firstPlayerCharacterStatistics.idPrefix).toBeNull();
   
    const secondPlayerCharacterStatistics = playerCharacterStatistics.getPlayerCharacterByName("Romulaner");
    expect(secondPlayerCharacterStatistics).toBeInstanceOf(IndividualPlayerCharacterStatistics);
    expect(secondPlayerCharacterStatistics.name).toBe("Romulaner");
    expect(secondPlayerCharacterStatistics.id).toBe(6);
    expect(secondPlayerCharacterStatistics.idPrefix).toBe("NPC");
  });

  test("duplicate registration", () => {
    const playerStatistics = new PlayerCharacterStatistics;
    const player1 = new PlayerNameAndIdResult;
    player1.id = 34108;
    player1.name = "[]U.C.W[] Scorga Empire";
    
    playerStatistics.registerPlayerCharacter(player1);
    playerStatistics.registerPlayerCharacter(player1);

    expect(playerStatistics.mentionedPlayerCharacters.length).toBe(1);
    
    const firstPlayerCharacterStatistics = playerStatistics.getPlayerCharacterById(34108);
    expect(firstPlayerCharacterStatistics.name).toBe("[]U.C.W[] Scorga Empire");
    expect(firstPlayerCharacterStatistics.id).toBe(34108);
    expect(firstPlayerCharacterStatistics.idPrefix).toBeNull();
  });

});