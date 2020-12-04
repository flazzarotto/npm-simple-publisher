"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.initMod = exports.initOptions = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _promptAsync = _interopRequireDefault(require("prompt-async"));

var _parseBoolean = require("./parseBoolean");

var _generatePackageJson = require("./generatePackageJson");

var _build = require("./build");

var _github = require("./github");

var _fileData = _interopRequireDefault(require("../data/fileData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

function init(fileDir, contextDir, args) {
  var _args$options$force = args.options.force,
      force = _args$options$force === void 0 ? false : _args$options$force;
  var files = ['.babelrc', '.gitignore', 'config.json' // 'packageJson.json'
  ];

  var _loop = function _loop() {
    var file = _files[_i];
    var targetFile = contextDir + (file !== 'config.json' ? file : 'config.local.json');
    var sourceData = _fileData["default"][file];

    function done(data) {
      if (_fs["default"].existsSync(targetFile)) {
        if (_fs["default"].lstatSync(targetFile).isDirectory()) {
          throw new Error('File ' + file + ' should not be a directory.');
        }

        if (!force) {
          throw new Error('File ' + file + ' already present.');
        }

        console.warn('File ' + file + ' will be replaced with fresh one.');
      }

      _fs["default"].writeFileSync(targetFile, data);
    }

    switch (file) {
      case 'config.json':
        var defaultConfig = JSON.parse(sourceData);
        var actualConfig = {};

        if (_fs["default"].existsSync(targetFile)) {
          actualConfig = JSON.parse(_fs["default"].readFileSync(targetFile).toString());
        }

        var properties = {};

        var nspData = _objectSpread(_objectSpread({}, defaultConfig), actualConfig);

        for (var name in defaultConfig) {
          var _nspData$name;

          properties[name] = {
            "default": (_nspData$name = nspData[name]) !== null && _nspData$name !== void 0 ? _nspData$name : '~'
          };

          if (name === 'NSP_PASSWORD') {
            properties[name].hidden = true;
          }
        }

        _promptAsync["default"].start();

        _promptAsync["default"].get({
          properties: properties
        }, function (err, result) {
          _promptAsync["default"].stop();

          var del = [];

          for (var _name in result) {
            if (!{}.toString.call(result[_name]).length) {
              del.push(_name);
            }
          }

          for (var _i2 = 0, _del = del; _i2 < _del.length; _i2++) {
            var d = _del[_i2];
            delete result[d];
          }

          var nspData = _objectSpread(_objectSpread(_objectSpread({}, defaultConfig), result), {}, {
            NSP_PACKAGE_NAME: _fs["default"].realpathSync(contextDir).replace(/^.*[\\\/]/, '')
          });

          nspData.NSP_PACKAGE_PRIVATE = (0, _parseBoolean.parseBoolean)(nspData.NSP_PACKAGE_PRIVATE);
          nspData.NSP_SCOPED_PACKAGE = (0, _parseBoolean.parseBoolean)(nspData.NSP_SCOPED_PACKAGE);

          for (var prop in nspData) {
            if (nspData[prop] === '~') {
              nspData[prop] = null;
            }
          }

          var github = (0, _github.isGithub)(nspData.NSP_GIT_REPOSITORY_HOMEPAGE);
          console.log(github);

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

          console.log(nspData);
          done(JSON.stringify(nspData, null, "\t"));

          _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    (0, _generatePackageJson.generatePackageJson)(fileDir, contextDir);
                    _context.next = 3;
                    return (0, _build.build)(fileDir, contextDir);

                  case 3:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }))();
        });

        break;

      default:
        done(sourceData);
        break;
    }
  };

  for (var _i = 0, _files = files; _i < _files.length; _i++) {
    _loop();
  }
}