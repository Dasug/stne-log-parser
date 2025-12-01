"use strict"

import {pattern, regex} from 'regex';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { addSubroutines } from '../util/regex-helper.js';
import PlayerNameAndId from './subroutine/player-name-and-id.js';
import LogDirection from '../enum/log-direction.js';
import LogMessage from './parse-result/log-message.js';
import { getLineNumber } from '../util/string-helper.js';

class LogHeadParser {
  static headPattern = addSubroutines(
    pattern`
      (?<=^|\n)
      \s*
      (?<log_direction> (?> Auslöser|Ziel|Trigger|Target|Acción\ Ejecutada:?|Objetivo))
      \s++
      (?<player> \g<playerNameAndId>)
      \s++
      (?: Datum|Date|Fecha)
      \s++
      (?<date_time> \d{2}\.\d{2}\.\d{4,}\ \d{2}:\d{2}:\d{2})
      \s*+
    `,
    {
    "playerNameAndId": PlayerNameAndId.asSubroutineDefinition(),
    },
    'g'
  );

  static bodyEndPattern = regex`
  (?:
    \s*
    (?> Markierung\ umkehren|Invert\ selection|Invertir\ Selección)
    \s+
  )
  `;

  /**
   * Parses one or more log messages including headers copy-pasted from the ingame log table. 
   * @param {string} text Text to parse
   */
  static parseMessages(text) {
    // prepare dayjs with custom parse format plugin
    dayjs.extend(customParseFormat);
    const matches = text.matchAll(LogHeadParser.headPattern);
    const heads = [];
    for(const match of matches){
      heads.push({
        from: match.index,
        to: match.index + match[0].length-1,
        match: match,
      });
    }

    const logs = [];
    heads.forEach((head, idx) => {
      const nextHead = heads[idx+1] ?? null;
      const bodyIndexStart = head.to+1;
      let potentialBodyIndexEnd = text.length;
      if(nextHead !== null) {
        potentialBodyIndexEnd = nextHead.from - 1;
      }
      const logBody = text.substring(bodyIndexStart, potentialBodyIndexEnd);

      // see if there's available indication that ends a body prematurely
      const bodyEndMatch = logBody.match(LogHeadParser.bodyEndPattern);
      const actualBodyEndIndex = bodyEndMatch?.index ?? logBody.length;
      const clippedLogBody = logBody.substring(0, actualBodyEndIndex).trim();

      let logDirection = LogDirection.incoming;
      if(['Ziel', 'Target', 'Objetivo'].includes(head.match.groups.log_direction)) {
        logDirection = LogDirection.outgoing;
      }
      const player = PlayerNameAndId.matchResult(head.match.groups.player.replaceAll("\n", ' ').replaceAll("\r", ''));
      const dateString = head.match.groups.date_time;
      const date = dayjs(dateString, 'DD.MM.YYYY HH:mm:ss', 'de').toDate();

      const log = new LogMessage;
      log.logDirection = logDirection;
      log.player = player;
      log.dateTime = date;
      log.messageBody = clippedLogBody;
      log.lineStart = getLineNumber(text, head.match.index);
      log.lineEnd = getLineNumber(text, head.match.index + head.match[0].length + actualBodyEndIndex - 1);
      log.messageBodyLineStartOffset = getLineNumber(head.match[0] + logBody, head.match[0].length);
      
      logs.push(log);
    });

    return logs;
  };

}

export default LogHeadParser;
