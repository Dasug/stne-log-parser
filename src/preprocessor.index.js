"use strict"

import { importAllDefault } from "./util/webpack-import-helper.js";

const preprocessorContext = import.meta.webpackContext('./preprocessor/',
  {
    recursive: false,
    regExp: /\.js$/,
  }
);
const preprocessorClasses = importAllDefault(preprocessorContext);

const preprocessors = Object.values(preprocessorClasses);

export {
  preprocessors as default,
  preprocessors,
  preprocessorClasses as preprocessorsByName,
};
