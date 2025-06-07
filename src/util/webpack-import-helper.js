"use strict"

function requireAll(r) { return r.keys().map(k => r(k)); }

function getDefaultImports(imports) {
  return imports.map(i => i.default);
}

function classesArrayToDict(imports) {
  const classes = {};
  for (let importEntry of imports) {
    const name = importEntry.name;
    classes[name] = importEntry;
  }

  return classes;
}

/**
 * 
 * @param context - Context received from import.meta.webpackContext
 * @returns {Object} Object of imported classes by class names
 */
function importAllDefault(context) {
  const imports = requireAll(context);
  const defaultImports = getDefaultImports(imports);

  return classesArrayToDict(defaultImports);
}

export { importAllDefault };