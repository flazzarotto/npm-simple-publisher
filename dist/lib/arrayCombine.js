"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayCombine = arrayCombine;
exports.map = map;

/**
 * Combines two arrays (same length) to give an object
 * @param keys
 * @param values
 * @returns {*}
 */
function arrayCombine(keys, values) {
  return keys.reduce(function (obj, key, index) {
    obj[key] = values[index];
    return obj;
  }, {});
}

function map(object, callback) {
  return arrayCombine(Object.keys(object), Object.values(object).map(callback));
}