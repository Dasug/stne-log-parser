"use strict"

import { importAllDefault } from "./util/webpack-import-helper.js";

const lineTypeContext = import.meta.webpackContext('./line-type/',
  {
    recursive: false,
    regExp: /-type\.js$/,
  }
);
const lineTypeParseResultContext = import.meta.webpackContext('./line-type/parse-result/',
  {
    recursive: false,
    regExp: /\.js$/,
  }
);
const lineTypeClasses = importAllDefault(lineTypeContext);
const lineTypeParseResultClasses = importAllDefault(lineTypeParseResultContext);

const lineTypes = Object.values(lineTypeClasses);
const lineTypeParseResults = Object.values(lineTypeParseResultClasses);

export {
  lineTypes as default,
  lineTypes,
  lineTypeClasses as lineTypesByName,
  lineTypeParseResults,
  lineTypeParseResultClasses as lineTypeParseResultsByName
};