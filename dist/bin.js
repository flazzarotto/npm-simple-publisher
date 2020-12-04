#!/usr/bin/env node
"use strict";

var _index = _interopRequireDefault(require("./index"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var contextDir = _fs["default"].realpathSync('.').replace(/\/+$/, '') + '/';
var fileDir = _fs["default"].realpathSync(__dirname).replace(/\/+$/, '') + '/';

_index["default"].call(fileDir, contextDir);