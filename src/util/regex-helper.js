"use strict"

import {regex, pattern} from 'regex';

function addSubroutines(mainPattern, subroutines) {
  const subroutineDefinitions = [];
  for(const [key, subroutine] of Object.entries(subroutines)) {
    subroutineDefinitions.push(
      pattern`(?<${key}> ${subroutine})`.toString()
    );
  }

  //const joinedSubroutineDefinitions = subroutineDefinitions.join("\n");
  const joinedSubroutineDefinitions = subroutineDefinitions.reduce(
    (accumulator, currentValue) =>
      pattern`${accumulator}
      ${currentValue}`,
    ''
  );
  

  return regex(
    // pretend that this is a raw string so that regex does not escape it
    {
      raw: [
        pattern`
        ${mainPattern}
        
        (?(DEFINE)
        ${joinedSubroutineDefinitions}
        )`
      ]
    }
  );
}

export {
  addSubroutines
}