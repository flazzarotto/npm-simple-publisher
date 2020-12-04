"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.build = build;
exports.buildMod = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _child_process = require("child_process");

var _request = _interopRequireDefault(require("request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var buildOptions = [];
var buildMod = {
  mod: 'build',
  description: 'Add dependencies, license and run build',
  options: buildOptions,
  exec: build
};
exports.buildMod = buildMod;

function build(_x, _x2) {
  return _build.apply(this, arguments);
}

function _build() {
  _build = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fileDir, contextDir) {
    var nspData, license;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nspData = JSON.parse(_fs["default"].readFileSync(contextDir + 'config.local.json').toString());

            if (_fs["default"].existsSync('.git')) {
              _context.next = 8;
              break;
            }

            console.info('Init git repository');
            _context.next = 5;
            return (0, _child_process.exec)('git init');

          case 5:
            if (!nspData.NSP_REPOSITORY_SSH_REMOTE) {
              _context.next = 8;
              break;
            }

            _context.next = 8;
            return (0, _child_process.exec)('git checkout -b main && git add . && git commit -m "first commit"\n' + 'git remote add origin ' + nspData.NSP_REPOSITORY_SSH_REMOTE + '\n' + 'git add . && git commit -m "first commit" && git push -u origin main');

          case 8:
            console.info('Adding dev dependancies');
            _context.next = 11;
            return (0, _child_process.exec)('yarn add -D @babel/preset-env @babel/core @babel/cli ' + ' && yarn install && yarn build');

          case 11:
            console.info('Generating license');
            license = 'https://raw.githubusercontent.com/spdx/license-list-data/master/text/' + nspData.NSP_PACKAGE_LICENSE + '.txt';

            _request["default"].get(license, function (error, response, body) {
              if (!error && response.statusCode === 200) {
                _fs["default"].writeFileSync(contextDir + 'LICENSE', body);
              } else {
                console.error(response.statusCode);
                console.error('Error fetching `' + nspData.NSP_PACKAGE_LICENSE + '` license.');
              }
            });

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _build.apply(this, arguments);
}