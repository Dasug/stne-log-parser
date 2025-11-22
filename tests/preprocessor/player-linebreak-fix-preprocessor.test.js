import { describe, expect, test } from '@jest/globals';
import PlayerLinebreakFixPreprocessor from '../../src/preprocessor/player-linebreak-fix-preprocessor.js';


describe('player linebreak fix preprocessor', () => {
  const preprocessorClass = PlayerLinebreakFixPreprocessor;
  test("preprocessor works", () => {
    const testLogEntry = String.raw`Kontakt zu Neauvest (66009, Cloverfield) von Dasug2
(2186) verloren! Letzte bekannte Position: 45|17`;
    const expectedResult = String.raw`Kontakt zu Neauvest (66009, Cloverfield) von Dasug2 (2186) verloren! Letzte bekannte Position: 45|17`;
    
    expect(preprocessorClass.preprocess(testLogEntry)).toBe(expectedResult);
  });
  test("preprocessor works multiple times", () => {
    const testLogEntry = String.raw`Kontakt zu Neauvest (66009, Cloverfield) von Dasug2
(2186) verloren! Letzte bekannte Position: 45|17
Kontakt zu Shoxe (72398, Paragenesis) von Dasug1
(NPC-2183) verloren! Letzte bekannte Position: 45|17`;
    const expectedResult = String.raw`Kontakt zu Neauvest (66009, Cloverfield) von Dasug2 (2186) verloren! Letzte bekannte Position: 45|17
Kontakt zu Shoxe (72398, Paragenesis) von Dasug1 (NPC-2183) verloren! Letzte bekannte Position: 45|17`;
    
    expect(preprocessorClass.preprocess(testLogEntry)).toBe(expectedResult);
  });
})
