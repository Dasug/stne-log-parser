import { describe, expect, test } from '@jest/globals';
import LogHeadParser from '../../src/regex/log-head-parser.js';
import LogDirection from '../../src/enum/log-direction.js';

describe('log head parser regex', () => {
  test("parses German incoming logs correctly", () => {
    const logMessages = LogHeadParser.parseMessages(String.raw`		Auslöser	Mortarion [OBV] * * *
(28076)	Datum	13.04.2025 14:01:07
Asuteroidodansu (NX-2567981, Adeos) von Mortarion [OBV] * * * (28076) ist in Sektor 255|270 eingeflogen
		Auslöser	
Kôntránisches VerwaltungsAmt [PeaceInUkraine]
(56813)	Datum	13.04.2025 13:47:17
Agrok (2579780, Nova) von Kôntránisches VerwaltungsAmt [PeaceInUkraine] (56813) ist in Sektor 102|373 eingeflogen`);
    expect(logMessages).not.toBeNull();
    
    expect(logMessages.length).toBe(2);

    const firstLog = logMessages[0];
    const secondLog = logMessages[1];

    expect(firstLog.player.id).toBe(28076);
    expect(firstLog.player.name).toBe("Mortarion [OBV] * * *");

    expect(firstLog.logDirection).toBe(LogDirection.incoming);

    expect(firstLog.dateTime.getDate()).toBe(13);
    expect(firstLog.dateTime.getMonth()).toBe(3);
    expect(firstLog.dateTime.getFullYear()).toBe(2025);
    expect(firstLog.dateTime.getHours()).toBe(14);
    expect(firstLog.dateTime.getMinutes()).toBe(1);
    expect(firstLog.dateTime.getSeconds()).toBe(7);
    
    expect(firstLog.lineStart).toBe(0);
    expect(firstLog.lineEnd).toBe(2);
    expect(firstLog.messageBodyLineStartOffset).toBe(2);

    expect(firstLog.messageBody).toBe(String.raw`Asuteroidodansu (NX-2567981, Adeos) von Mortarion [OBV] * * * (28076) ist in Sektor 255|270 eingeflogen`);

    expect(secondLog.player.id).toBe(56813);
    expect(secondLog.player.name).toBe("Kôntránisches VerwaltungsAmt [PeaceInUkraine]");

    expect(secondLog.logDirection).toBe(LogDirection.incoming);

    expect(secondLog.dateTime.getDate()).toBe(13);
    expect(secondLog.dateTime.getMonth()).toBe(3);
    expect(secondLog.dateTime.getFullYear()).toBe(2025);
    expect(secondLog.dateTime.getHours()).toBe(13);
    expect(secondLog.dateTime.getMinutes()).toBe(47);
    expect(secondLog.dateTime.getSeconds()).toBe(17);

    expect(secondLog.lineStart).toBe(3);
    expect(secondLog.lineEnd).toBe(6);
    expect(secondLog.messageBodyLineStartOffset).toBe(3);

    expect(secondLog.messageBody).toBe(String.raw`Agrok (2579780, Nova) von Kôntránisches VerwaltungsAmt [PeaceInUkraine] (56813) ist in Sektor 102|373 eingeflogen`);
  });
});
