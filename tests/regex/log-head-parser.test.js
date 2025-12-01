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

  test("parses outgoing test server log boundary correctly", () => {
    const logMessages = LogHeadParser.parseMessages(String.raw`		Ziel	Dasug2
(2186)	Datum	21.11.2025 19:23:07
Der Design Modus ist aktiviert

Krekrit (72378, AntaresD) dockt im Sektor @22|14 von Heimatsdock (69316, Raumdock) ab
AC: 1|70 DC: 1|25 active False
Schwere Disrupt(1) >72378 # 55 WS 1| DSR31,47| KT 12,15 ( 2,16)[ 0,00| 8,69|250,00| 0,25]| TW 80| D 55,0 EF1,00-> 5 + 0
Disruptorstrahl(1) >72378 # 14 WS 1| DSR 9,34| KT 12,40 ( 2,41)[ 0,00| 34,14|250,00| 0,07]| TW 93| D 14,0 EF1,00-> 2 + 0
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|377,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1502 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2264,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 316 + 0
Schwere Disrupt(1) >71849 # 55 WS 13| DSR36,85| KT 10,55 ( 0,55)[ 0,00| 8,29|250,00| 0,07]| TW 94| D 55,0 EF1,00-> 215 + 0
Disruptorstrahl(1) >71849 # 14 WS 13| DSR10,00| KT 10,00 ( 0,00)[ 0,00| 32,57|250,00| 0,00]| TW100| D 14,0 EF1,00-> 62 + 0
Def 59,5 Att 70 C 1,8
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15807
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|376,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1506 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2258,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 317 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15765
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|375,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1510 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2252,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 318 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15723
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|374,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1514 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2246,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 319 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15681
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|373,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1518 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2240,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 320 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15639
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|372,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1522 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2234,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 320 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15597
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|371,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1526 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2228,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 321 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15555
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|370,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1530 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2222,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 322 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15513
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|369,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1534 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2216,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 323 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15471
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|368,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1538 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2210,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 324 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15429
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|367,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1543 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2204,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 325 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15387
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|366,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1547 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2198,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 326 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15345
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,73| KT 12,26 ( 2,27)[ 0,00|365,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1584 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2192,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 327 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15303
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|364,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1555 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2186,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 328 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Schwere Disruptor Kanonen und Stärke 47/55/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 13 Punkte
Heimatsdock (69316, Raumdock) nimmt 42 Schaden, Hüllenintegrität sinkt auf 15261
ResortAttackedShip: 3
Schwere Disrupt(1) >69316 # 42 WS1196| DSR29,70| KT 12,51 ( 2,53)[ 0,00|363,36|250,00| 0,01]| TW 99| D 42,0 EF1,00-> 1560 + 0
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2180,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 328 + 0
Iowa Typ C Epup (NX-69357, Iowa Typ C) von Dasug2 (2186) schlägt Raumdock Heimatsdock (69316, Raumdock) mit Disruptorstrahl und Stärke 14/14/0 zurück
Panzerung von Heimatsdock (69316, Raumdock) schwächt Angriff um 7 Punkte
Heimatsdock (69316, Raumdock) nimmt 7 Schaden, Hüllenintegrität sinkt auf 15254
ResortAttackedShip: 3
Disruptorstrahl(1) >69316 # 7 WS1196| DSR 5,00| KT 10,00 ( 0,00)[ 0,00|2179,14|250,00| 0,00]| TW100| D 7,0 EF1,00-> 329 + 0
22,5 Verteidigungskosten 22|14
Markierung umkehren
	
	
	  Ordner leeren  	`);

    expect(logMessages).not.toBeNull();
    
    expect(logMessages.length).toBe(1);

    const firstLog = logMessages[0];

    expect(firstLog.player.id).toBe(2186);
    expect(firstLog.player.name).toBe("Dasug2");

    expect(firstLog.logDirection).toBe(LogDirection.outgoing);

    expect(firstLog.dateTime.getDate()).toBe(21);
    expect(firstLog.dateTime.getMonth()).toBe(10);
    expect(firstLog.dateTime.getFullYear()).toBe(2025);
    expect(firstLog.dateTime.getHours()).toBe(19);
    expect(firstLog.dateTime.getMinutes()).toBe(23);
    expect(firstLog.dateTime.getSeconds()).toBe(7);
    
    expect(firstLog.lineStart).toBe(0);
    expect(firstLog.lineEnd).toBe(102);
    expect(firstLog.messageBodyLineStartOffset).toBe(2);

    expect(firstLog.messageBody.startsWith("Der Design Modus ist aktiviert")).toBe(true);
    expect(firstLog.messageBody.endsWith("22,5 Verteidigungskosten 22|14")).toBe(true);
  });
});
