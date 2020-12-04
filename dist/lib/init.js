"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.initMod = exports.initOptions = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _parseBoolean = require("./parseBoolean");

var _generatePackageJson = require("./generatePackageJson");

var _build = require("./build");

var _github = require("./github");

var _data = _interopRequireDefault(require("../data"));

var _nodeCommandManager = require("@kebab-case/node-command-manager");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var prompt = new _nodeCommandManager.Prompt();
var initOptions = [{
  name: 'force',
  "short": 'f',
  type: 'boolean',
  description: 'Force file override (if project not empty)',
  example: "'kc-nps init --force' or 'script -f'"
}];
exports.initOptions = initOptions;
var initMod = {
  mod: 'init',
  description: 'Initialize project',
  options: initOptions,
  exec: init
};
exports.initMod = initMod;

function init(_x, _x2, _x3) {
  return _init.apply(this, arguments);
}

function _init() {
  _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fileDir, contextDir, args) {
    var _args$options$force, force, files, _loop, _i, _files;

    return regeneratorRuntime.wrap(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _args$options$force = args.options.force, force = _args$options$force === void 0 ? false : _args$options$force;
            files = ['.babelrc', '.gitignore', 'config.json' // 'packageJson.json'
            ];
            _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
              var file, targetFile, sourceData, done, defaultConfig, actualConfig, properties, nspData, name, _nspData$name, result, del, _name, _i2, _del, d, prop, github;

              return regeneratorRuntime.wrap(function _loop$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      done = function _done(data) {
                        if (_fs["default"].existsSync(targetFile)) {
                          if (_fs["default"].lstatSync(targetFile).isDirectory()) {
                            throw new Error('File ' + file + ' should not be a directory.');
                          }

                          if (!force) {
                            throw new Error('File ' + file + ' already present.');
                          }

                          _nodeCommandManager.console.warn('File ' + file + ' will be replaced with fresh one.');
                        }

                        _fs["default"].writeFileSync(targetFile, data);
                      };

                      file = _files[_i];
                      targetFile = contextDir + (file !== 'config.json' ? file : 'config.local.json');
                      sourceData = _data["default"][file];
                      _context.t0 = file;
                      _context.next = _context.t0 === 'config.json' ? 7 : 32;
                      break;

                    case 7:
                      defaultConfig = JSON.parse(sourceData);
                      actualConfig = {};

                      if (_fs["default"].existsSync(targetFile)) {
                        actualConfig = JSON.parse(_fs["default"].readFileSync(targetFile).toString());
                      }

                      properties = {};
                      nspData = _objectSpread(_objectSpread({}, defaultConfig), actualConfig);

                      for (name in defaultConfig) {
                        properties[name] = {
                          "default": (_nspData$name = nspData[name]) !== null && _nspData$name !== void 0 ? _nspData$name : '~'
                        };

                        if (name === 'NSP_PASSWORD') {
                          properties[name].hidden = true;
                        }
                      }

                      _context.next = 15;
                      return prompt.call(properties);

                    case 15:
                      result = _context.sent;
                      del = [];

                      for (_name in result) {
                        if (!{}.toString.call(result[_name]).length) {
                          del.push(_name);
                        }
                      }

                      for (_i2 = 0, _del = del; _i2 < _del.length; _i2++) {
                        d = _del[_i2];
                        delete result[d];
                      }

                      nspData = _objectSpread(_objectSpread(_objectSpread({}, defaultConfig), result), {}, {
                        NSP_PACKAGE_NAME: _fs["default"].realpathSync(contextDir).replace(/^.*[\\\/]/, '')
                      });
                      nspData.NSP_PACKAGE_PRIVATE = (0, _parseBoolean.parseBoolean)(nspData.NSP_PACKAGE_PRIVATE);
                      nspData.NSP_SCOPED_PACKAGE = (0, _parseBoolean.parseBoolean)(nspData.NSP_SCOPED_PACKAGE);

                      for (prop in nspData) {
                        if (nspData[prop] === '~') {
                          nspData[prop] = null;
                        }
                      }

                      github = (0, _github.isGithub)(nspData.NSP_GIT_REPOSITORY_HOMEPAGE);

                      _nodeCommandManager.console.log(github);

                      if (github) {
                        if (!nspData.NSP_ISSUES) {
                          nspData.NSP_ISSUES = (0, _github.generateGithubIssues)(github);
                        }

                        if (!nspData.NSP_REPOSITORY_REMOTE) {
                          nspData.NSP_REPOSITORY_REMOTE = (0, _github.generateGithubRemote)(github);
                        }

                        if (!nspData.NSP_REPOSITORY_SSH_REMOTE) {
                          nspData.NSP_REPOSITORY_SSH_REMOTE = (0, _github.generateGithubSshRemote)(github);
                        }
                      }

                      _nodeCommandManager.console.log(nspData);

                      done(JSON.stringify(nspData, null, "\t"));
                      (0, _generatePackageJson.generatePackageJson)(fileDir, contextDir);
                      _context.next = 31;
                      return (0, _build.build)(fileDir, contextDir, {
                        license: true
                      });

                    case 31:
                      return _context.abrupt("break", 34);

                    case 32:
                      done(sourceData);
                      return _context.abrupt("break", 34);

                    case 34:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _loop);
            });
            _i = 0, _files = files;

          case 4:
            if (!(_i < _files.length)) {
              _context2.next = 9;
              break;
            }

            return _context2.delegateYield(_loop(), "t0", 6);

          case 6:
            _i++;
            _context2.next = 4;
            break;

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee);
  }));
  return _init.apply(this, arguments);
}