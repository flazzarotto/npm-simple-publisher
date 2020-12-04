"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _babelrc = _interopRequireDefault(require("babelrc"));

var _gitignore = _interopRequireDefault(require(".gitignore.js"));

var _configJson = _interopRequireDefault(require("./config.json.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  '.babelrc': JSON.stringify(_babelrc["default"]),
  '.gitignore': _gitignore["default"],
  'config.json': JSON.stringify(_configJson["default"])
};
exports["default"] = _default;