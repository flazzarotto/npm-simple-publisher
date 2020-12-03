"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.initOptions = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _prompt = _interopRequireDefault(require("prompt"));

var _parseBoolean = require("./parseBoolean");

var _child_process = require("child_process");

var _generatePackageJson = require("../generatePackageJson");

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
  example: "'kc-nps-init --force' or 'script -f'"
}];
exports.initOptions = initOptions;

function init(dir, args) {
  var _args$options$force = args.options.force,
      force = _args$options$force === void 0 ? false : _args$options$force;
  var files = ['.babelrc', '.gitignore', 'config.json' // 'package.json'
  ];

  var _loop = function _loop() {
    var file = _files[_i];
    var targetFile = file !== 'config.json' ? './' + file : './config.local.json';
    var sourceFile = dir + file;

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
        var defaultConfig = JSON.parse(_fs["default"].readFileSync(sourceFile).toString());
        var properties = {};

        for (var name in defaultConfig) {
          properties[name] = {
            "default": defaultConfig[name]
          };

          if (name === 'NSP_PASSWORD') {
            properties[name].hidden = true;
          }
        }

        _prompt["default"].start();

        _prompt["default"].get({
          properties: properties
        }, function (err, result) {
          _prompt["default"].stop();

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
            NSP_PACKAGE_NAME: _fs["default"].realpathSync('.').replace(/^.*[\\\/]/, '')
          });

          nspData.NSP_PACKAGE_PRIVATE = (0, _parseBoolean.parseBoolean)(nspData.NSP_PACKAGE_PRIVATE);
          nspData.NSP_SCOPED_PACKAGE = (0, _parseBoolean.parseBoolean)(nspData.NSP_SCOPED_PACKAGE);

          for (var prop in nspData) {
            if (nspData[prop] === '~') {
              nspData[prop] = null;
            }
          }

          var github = isGithub(nspData.NSP_GIT_REPOSITORY_HOMEPAGE);

          if (github) {
            if (!nspData.NSP_ISSUES) {
              nspData.NSP_ISSUES = generateGithubIssues(github);
            }

            if (!nspData.NSP_REPOSITORY_REMOTE) {
              nspData.NSP_REPOSITORY_REMOTE = generateGithubRemote(github);
            }
          }

          done(JSON.stringify(nspData, null, "\t"));

          _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    // TODO replace with function call
                    (0, _generatePackageJson.generatePackageJson)(dir);

                    if (_fs["default"].existsSync('.git')) {
                      _context.next = 5;
                      break;
                    }

                    console.info('Init git repository');
                    _context.next = 5;
                    return (0, _child_process.exec)('git init');

                  case 5:
                    _context.next = 7;
                    return (0, _child_process.exec)('yarn add -D @babel/preset-env @babel/core @babel/cli && yarn install');

                  case 7:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }))();
        });

        break;

      default:
        done(_fs["default"].readFileSync(sourceFile));
        break;
    }
  };

  for (var _i = 0, _files = files; _i < _files.length; _i++) {
    _loop();
  }
}

var githubRegexp = /^https:\/\/github.com\/([^\\]+)\/([^\\]+)$/; // 1 => username, 2 => repo name

function isGithub(url) {
  return url && {}.prototype.toString.call(url).match(githubRegexp);
}

function generateGithubRemote(parsedGithubRepoHomepage) {
  return parsedGithubRepoHomepage[0].replace(/\/$/, '') + '.git';
}

function generateGithubIssues(parsedGithubRepoHomepage) {
  return parsedGithubRepoHomepage[0].replace(/\/$/, '') + '/issues';
}