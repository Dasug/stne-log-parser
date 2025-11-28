"use strict"

/**
 * calls the given function on every element inside the object
 * @param {Object} object object to iterate through
 * @param {(value:any, key:string) => any} callbackFunction function to call on every object item
 * @returns {Object.<string, any>} objects with the values set to the return value of the callbackFunction.
 * @see Array.map
 */
function mapObject(object, callbackFunction) {
  const returnObject = {};
  for(const [key, value] of Object.entries(object)) {
    returnObject[key] = callbackFunction(value, key);
  }

  return returnObject;
}

export {mapObject}
