#!/usr/bin/env node
"use strict";

var _fs = _interopRequireDefault(require("fs"));

var _child_process = require("child_process");

require("core-js/stable");

require("regenerator-runtime/runtime");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

if (!_fs["default"].lstatSync('src').isDirectory()) {
  throw new Error('This seems not to be a project directory, `src` folder is missing.');
}

_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (_fs["default"].existsSync('.git')) {
            _context.next = 10;
            break;
          }

          console.info('Init git repository');
          _context.next = 4;
          return (0, _child_process.exec)('git init');

        case 4:
          _context.next = 6;
          return (0, _child_process.exec)('yarn add -D @babel/cli');

        case 6:
          _context.next = 8;
          return (0, _child_process.exec)('yarn add -D @babel/core');

        case 8:
          _context.next = 10;
          return (0, _child_process.exec)('yarn add -D @babel/preset-env');

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();