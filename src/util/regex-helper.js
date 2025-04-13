"use strict"

import {regex, pattern} from 'regex';

function addSubroutines(mainPattern, subroutines, flags = "") {
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
  
  // pretend that this is a raw string so that regex does not escape it
  const params = {
    raw: [
      pattern`
      ${mainPattern}
      
      (?(DEFINE)
      ${joinedSubroutineDefinitions}
      )`
    ]
  };

  if(typeof flags === "string" && flags.length > 0) {
    return regex(flags)(params);
  }
  return regex(params);
}

export {
  addSubroutines
}