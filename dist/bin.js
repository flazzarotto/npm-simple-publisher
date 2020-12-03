#!/usr/bin/env node
"use strict";

var _ = _interopRequireDefault(require("./"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var contextDir = _fs["default"].realpathSync('.').replace(/\/+$/, '') + '/';
var fileDir = _fs["default"].realpathSync(__dirname).replace(/\/+$/, '') + '/';

_["default"].call(fileDir, contextDir);