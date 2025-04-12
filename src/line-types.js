"use strict"

function requireAll(r) { return r.keys().map(k => r(k)); }
const lineTypeContext = import.meta.webpackContext('./line-type/',
  {
    recursive: false,
    regExp: /-type\.js$/
  }
);
const lineTypesImports = requireAll(lineTypeContext);
const lineTypes = lineTypesImports.map(type => type.default);

const lineTypeClasses = {};
for (let lineType of lineTypes) {
  const name = lineType.name;
  lineTypeClasses[name] = lineType;
}

export {lineTypes as default, lineTypes, lineTypeClasses as lineTypesByName};