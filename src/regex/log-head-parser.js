"use strict"

import {pattern} from 'regex';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { addSubroutines } from '../util/regex-helper.js';
import PlayerNameAndId from './subroutine/player-name-and-id.js';
import LogDirection from '../enum/log-direction.js';
import LogMessage from './parse-result/log-message.js';

class LogHeadParser {
  static regexPattern = addSubroutines(
    pattern`
      \s*
      (?<log_direction> (?: Auslöser|Ziel|Trigger|Target|Acción\ Ejecutada:?|Objetivo))
      \s+
      (?<player> \g<playerNameAndId>)
      \s+
      (?: Datum|Date|Fecha)
      \s+
      (?<date_time> \d{2}\.\d{2}\.\d{4,}\ \d{2}:\d{2}:\d{2})
      \s*
      (?<log_body> (?: .+?\r?\n?)+?)
      
      # look ahead if there's either the end or the start of the next log
      (?=
        $
        |
        (?:
          \s+
          (?: Auslöser|Ziel|Trigger|Target|Acción\ Ejecutada:?|Objetivo)
          \s+
          \g<playerNameAndId>
        )
      )
    `,
    {
    "playerNameAndId": PlayerNameAndId.asSubroutineDefinition(),
    },
    'g'
  );

  /**
   * Parses one or more log messages including headers copy-pasted from the ingame log table. 
   */
  static parseMessages(text) {
    // prepare dayjs with custom parse format plugin
    dayjs.extend(customParseFormat);
    const matches = text.matchAll(LogHeadParser.regexPattern);

    const logs = [];
    for(const match of matches){
      let logDirection = LogDirection.incoming;
      if(['Ziel', 'Target', 'Objetivo'].includes(match.groups.log_direction)) {
        logDirection = LogDirection.outgoing;
      }
      const player = PlayerNameAndId.matchResult(match.groups.player.replaceAll("\n", ' ').replaceAll("\r", ''));
      const logBody = String(match.groups.log_body).trim();
      const dateString = match.groups.date_time;
      const date = dayjs(dateString, 'DD.MM.YYYY HH:mm:ss', 'de').toDate();

      const log = new LogMessage;
      log.logDirection = logDirection;
      log.player = player;
      log.dateTime = date;
      log.messageBody = logBody;
      
      logs.push(log);
    }

    return logs;
  };

}

export default LogHeadParser;