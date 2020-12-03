"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseBoolean = parseBoolean;

function parseBoolean(string) {
  return !!(string === 'true' || parseInt(string));
}