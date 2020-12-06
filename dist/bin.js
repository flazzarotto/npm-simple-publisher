#!/usr/bin/env node
"use strict";

var _index = _interopRequireDefault(require("./index"));

var _fs = _interopRequireDefault(require("fs"));

var _nodeCommandManager = require("@kebab-case/node-command-manager");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var contextDir = _fs["default"].realpathSync('.').replace(/\/+$/, '') + '/';
var fileDir = _fs["default"].realpathSync(__dirname).replace(/\/+$/, '') + '/';

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return _index["default"].call(fileDir, contextDir);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))()["catch"](function (e) {
  _nodeCommandManager.console.error(e);
});