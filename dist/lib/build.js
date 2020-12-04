"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
exports.buildMod = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _child_process = require("child_process");

var _axios = _interopRequireDefault(require("axios"));

var _nodeCommandManager = require("@kebab-case/node-command-manager");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var buildOptions = [{
  name: 'skip-dependencies',
  type: 'boolean',
  "short": 's',
  description: 'Skip adding dev dependencies',
  example: "'kc-nps build --skip-dependencies' or 'kc-nps build -s'"
}, {
  name: 'license',
  type: 'boolean',
  "short": 'l',
  description: 'Generate license',
  example: "'kc-nps build --license' or 'kc-nps build -l'"
}];
var buildMod = {
  mod: 'build',
  description: 'Add dependencies, license and run build',
  options: buildOptions,
  exec: build
};
exports.buildMod = buildMod;

function build(_x, _x2, _x3) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fileDir, contextDir, args) {
    var nspData, license, body;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            args = _objectSpread({
              options: {}
            }, args);
            nspData = JSON.parse(_fs["default"].readFileSync(contextDir + 'config.local.json').toString());

            if (_fs["default"].existsSync('.git')) {
              _context.next = 9;
              break;
            }

            _nodeCommandManager.console.info('Init git repository');

            _context.next = 6;
            return (0, _child_process.exec)('git init');

          case 6:
            if (!nspData.NSP_REPOSITORY_SSH_REMOTE) {
              _context.next = 9;
              break;
            }

            _context.next = 9;
            return (0, _child_process.exec)('git checkout -b main && git add . && git commit -m "first commit"\n' + 'git remote add origin ' + nspData.NSP_REPOSITORY_SSH_REMOTE + '\n' + 'git add . && git commit -m "first commit" && git push -u origin main');

          case 9:
            if (args.options['skip-dependencies']) {
              _context.next = 15;
              break;
            }

            _nodeCommandManager.console.info('Adding dev dependancies');

            _context.next = 13;
            return (0, _nodeCommandManager.interactiveShell)('yarn', ['add', '-D', '@babel/preset-env', '@babel/core', '@babel/cli', 'babel-eslint'], null, false);

          case 13:
            _context.next = 15;
            return (0, _nodeCommandManager.interactiveShell)('yarn', ['install'], null, false);

          case 15:
            _nodeCommandManager.console.info('Yarn build');

            _context.next = 18;
            return (0, _nodeCommandManager.interactiveShell)('yarn', ['build'], null, false);

          case 18:
            if (!args.options.license) {
              _context.next = 32;
              break;
            }

            _nodeCommandManager.console.info('Generating license');

            license = 'https://raw.githubusercontent.com/spdx/license-list-data/master/text/' + nspData.NSP_PACKAGE_LICENSE + '.txt';
            _context.prev = 21;
            _context.next = 24;
            return _axios["default"].get(license);

          case 24:
            body = _context.sent.data;

            _fs["default"].writeFileSync(contextDir + 'LICENSE', body);

            _context.next = 32;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](21);

            _nodeCommandManager.console.error(_context.t0);

            _nodeCommandManager.console.error('Error fetching `' + nspData.NSP_PACKAGE_LICENSE + '` license.');

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[21, 28]]);
  }));
  return _build.apply(this, arguments);
}