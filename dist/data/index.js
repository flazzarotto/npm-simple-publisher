"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _babelrc = _interopRequireDefault(require("./babelrc"));

var _gitignore = _interopRequireDefault(require("./gitignore"));

var _configJson = _interopRequireDefault(require("./config.json.js"));

var _arrayCombine = require("../lib/arrayCombine");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  configProperties: _configJson["default"],
  '.babelrc': JSON.stringify(_babelrc["default"]),
  '.gitignore': _gitignore["default"],
  'config.json': JSON.stringify((0, _arrayCombine.map)(_configJson["default"], function (prop) {
    return prop["default"];
  }))
};
exports["default"] = _default;