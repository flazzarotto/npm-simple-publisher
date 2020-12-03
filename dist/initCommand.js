#!/usr/bin/env node
"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _argv = _interopRequireDefault(require("argv"));

var _getVersion = require("./lib/getVersion");

require("core-js/stable");

require("regenerator-runtime/runtime");

var _init = require("./lib/init");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (!_fs["default"].lstatSync('src').isDirectory()) {
  throw new Error('This seems not to be a project directory, `src` folder is missing.');
}

_argv["default"].option(_init.initOptions);

_argv["default"].version(_getVersion.version);

var args = _argv["default"].run();

var dir = __dirname + '/../data/';
(0, _init.init)(dir, args);