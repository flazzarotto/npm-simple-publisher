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
}, {
  name: 'skip',
  "short": 's',
  type: 'boolean',
  description: 'Skip existing files',
  example: "'kc-nps init --skip' or 'script -s'"
}, {
  name: 'update',
  "short": 'u',
  type: 'boolean',
  description: 'Force package.json update (when --skip option is used)',
  example: "'kc-nps init --skip --update' or 'script -s -u'"
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
  _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(fileDir, contextDir, args) {
    var _args$options, _args$options$force, force, _args$options$skip, skip, _args$options$update, update, files, _loop, _i, _files;

    return regeneratorRuntime.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(!_fs["default"].existsSync(contextDir + 'src') || !_fs["default"].lstatSync(contextDir + 'src').isDirectory())) {
              _context3.next = 12;
              break;
            }

            if (args.options.force) {
              _context3.next = 4;
              break;
            }

            _nodeCommandManager.console.error('This seems not to be a project directory, `src` dir is missing.' + ' Use init --force to create dir');

            return _context3.abrupt("return");

          case 4:
            _context3.prev = 4;

            _fs["default"].mkdirSync(contextDir + 'src');

            _context3.next = 12;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](4);

            _nodeCommandManager.console.error(_context3.t0);

            return _context3.abrupt("return");

          case 12:
            _args$options = args.options, _args$options$force = _args$options.force, force = _args$options$force === void 0 ? false : _args$options$force, _args$options$skip = _args$options.skip, skip = _args$options$skip === void 0 ? false : _args$options$skip, _args$options$update = _args$options.update, update = _args$options$update === void 0 ? false : _args$options$update;
            files = Object.keys(_data["default"]);
            _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop() {
              var file, targetFile, sourceData, done, processConfigJson;
              return regeneratorRuntime.wrap(function _loop$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      file = _files[_i];
                      targetFile = contextDir + (file !== 'config.json' ? file : 'config.local.json');
                      sourceData = _data["default"][file];

                      done = function done(data) {
                        if (_fs["default"].existsSync(targetFile)) {
                          if (_fs["default"].lstatSync(targetFile).isDirectory()) {
                            throw new Error('File ' + file + ' should not be a directory.');
                          }

                          if (skip) {
                            _nodeCommandManager.console.info('Skipping existing file ' + file + '.');

                            return;
                          }

                          if (!force) {
                            throw new Error('File ' + file + ' already present. Use --force (-f) to override file or --skip (-s).');
                          }

                          _nodeCommandManager.console.warn('File ' + file + ' will be replaced with fresh one.');
                        } else {
                          _nodeCommandManager.console.info('Generating ' + file + '.');
                        }

                        _fs["default"].writeFileSync(targetFile, data);
                      };

                      processConfigJson = /*#__PURE__*/function () {
                        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                          var pJson, defaultConfig, actualConfig, properties, nspData, name, _nspData$name, result, del, _name, _i2, _del, d, prop, github;

                          return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  pJson = contextDir + 'package.json';

                                  if (!_fs["default"].existsSync(pJson)) {
                                    _context.next = 5;
                                    break;
                                  }

                                  if (!(skip && !update)) {
                                    _context.next = 5;
                                    break;
                                  }

                                  _nodeCommandManager.console.info('package.json already present. Use --skip --update (-su) to update file.');

                                  return _context.abrupt("return");

                                case 5:
                                  defaultConfig = JSON.parse(sourceData);
                                  actualConfig = {};

                                  if (_fs["default"].existsSync(targetFile)) {
                                    actualConfig = JSON.parse(_fs["default"].readFileSync(targetFile).toString());
                                  }

                                  properties = _data["default"].configProperties;
                                  nspData = _objectSpread(_objectSpread({}, defaultConfig), actualConfig);

                                  for (name in defaultConfig) {
                                    properties[name]["default"] = (_nspData$name = nspData[name]) !== null && _nspData$name !== void 0 ? _nspData$name : properties[name]["default"];
                                  }

                                  _nodeCommandManager.console.info('Please fill in following values');

                                  _nodeCommandManager.console.warn('Note that password will NOT be stored outside of config.local.json which is a' + ' .gitignored file');

                                  _nodeCommandManager.console.warn('If you don\'t want to store your npm password in config.local.json leave field blank.' + ' You will have to type it when publishing.');

                                  _context.next = 16;
                                  return prompt.call(properties);

                                case 16:
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
                                    NSP_PACKAGE_NAME: _fs["default"].realpathSync(contextDir).replace(/^.*[/]/, '')
                                  });
                                  nspData.NSP_PACKAGE_PRIVATE = (0, _parseBoolean.parseBoolean)(nspData.NSP_PACKAGE_PRIVATE);
                                  nspData.NSP_SCOPED_PACKAGE = (0, _parseBoolean.parseBoolean)(nspData.NSP_SCOPED_PACKAGE);

                                  for (prop in nspData) {
                                    if (nspData[prop] === '~') {
                                      nspData[prop] = null;
                                    }
                                  }

                                  github = (0, _github.isGithub)(nspData.NSP_REPOSITORY_REMOTE);

                                  if (github) {
                                    if (!nspData.NSP_ISSUES) {
                                      nspData.NSP_ISSUES = (0, _github.generateGithubIssues)(github);
                                    }

                                    if (!nspData.NSP_GIT_REPOSITORY_HOMEPAGE) {
                                      nspData.NSP_GIT_REPOSITORY_HOMEPAGE = (0, _github.generateGithubHomepage)(github);
                                    }

                                    if (!nspData.NSP_REPOSITORY_SSH_REMOTE) {
                                      nspData.NSP_REPOSITORY_SSH_REMOTE = (0, _github.generateGithubSshRemote)(github);
                                    }
                                  }

                                  if (_fs["default"].existsSync(targetFile)) {
                                    _fs["default"].unlinkSync(targetFile);
                                  }

                                  done(JSON.stringify(nspData, null, "\t"));
                                  (0, _generatePackageJson.generatePackageJson)(fileDir, contextDir);

                                case 29:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee);
                        }));

                        return function processConfigJson() {
                          return _ref.apply(this, arguments);
                        };
                      }();

                      _context2.t0 = file;
                      _context2.next = _context2.t0 === 'configProperties' ? 8 : _context2.t0 === 'config.json' ? 9 : 12;
                      break;

                    case 8:
                      return _context2.abrupt("break", 14);

                    case 9:
                      _context2.next = 11;
                      return processConfigJson();

                    case 11:
                      return _context2.abrupt("break", 14);

                    case 12:
                      done(sourceData);
                      return _context2.abrupt("break", 14);

                    case 14:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _loop);
            });
            _i = 0, _files = files;

          case 16:
            if (!(_i < _files.length)) {
              _context3.next = 21;
              break;
            }

            return _context3.delegateYield(_loop(), "t1", 18);

          case 18:
            _i++;
            _context3.next = 16;
            break;

          case 21:
            _context3.next = 23;
            return (0, _build.build)(fileDir, contextDir, {
              options: {
                license: true
              }
            });

          case 23:
            _nodeCommandManager.console.warn('Init done. Please ensure that all of `./config.local.json` data is valid.');

          case 24:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2, null, [[4, 8]]);
  }));
  return _init.apply(this, arguments);
}