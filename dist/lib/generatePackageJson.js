"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generatePackageJson = generatePackageJson;
exports.packageMod = exports.packageOptions = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _data = _interopRequireDefault(require("../data"));

var _nodeCommandManager = require("@kebab-case/node-command-manager");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var packageOptions = [];
exports.packageOptions = packageOptions;
var packageMod = {
  mod: 'generate-pj',
  description: 'Generate packageJson.json from config.local.json',
  options: packageOptions,
  exec: generatePackageJson
};
exports.packageMod = packageMod;

function generatePackageJson(fileDir, contextDir, args) {
  var _nspData$NSP_SCOPE_NA;

  var packageJsonFile = contextDir + 'package.json';

  _nodeCommandManager.console.info('Adding package.json settings');

  var packageJsonData;

  try {
    packageJsonData = _fs["default"].readFileSync(packageJsonFile).toString();
  } catch (e) {
    _nodeCommandManager.console.warn('Creating a new package.json');

    packageJsonData = '{}';
  }

  var nspData = _objectSpread(_objectSpread({}, JSON.parse(_data["default"]['config.json'])), JSON.parse(_fs["default"].readFileSync('config.local.json').toString()));

  packageJsonData = _objectSpread(_objectSpread({}, JSON.parse(packageJsonData)), {}, {
    name: (nspData.NSP_SCOPED_PACKAGE ? '@' + ((_nspData$NSP_SCOPE_NA = nspData.NSP_SCOPE_NAME) !== null && _nspData$NSP_SCOPE_NA !== void 0 ? _nspData$NSP_SCOPE_NA : nspData.NSP_USERNAME).replace(/(^@)|(\/$)/g, '') + '/' : '') + nspData.NSP_PACKAGE_NAME,
    version: nspData.NSP_PACKAGE_VERSION,
    description: nspData.NSP_PACKAGE_DESCRIPTION,
    author: nspData.NSP_USERNAME,
    main: './dist/' + nspData.NSP_APP_ENTRY_POINT,
    module: './src/' + nspData.NSP_APP_ENTRY_POINT,
    license: nspData.NSP_PACKAGE_LICENSE,
    keywords: nspData.NSP_PACKAGE_KEYWORDS.split(',').map(function (x) {
      return x.replace(/(^\s)|(\s$)/g, '');
    }),
    "private": nspData.NSP_PACKAGE_PRIVATE,
    scripts: packageJsonData.scripts || {
      build: "rm -rf dist && babel src -d dist && chmod +x ./dist/*.js"
    },
    eslintConfig: packageJsonData.eslintConfig || {
      "root": true,
      "env": {
        "node": true
      },
      "extends": ["eslint:recommended"],
      "parserOptions": {
        "parser": "babel-eslint"
      },
      "rules": {}
    }
  });

  if (nspData.NSP_GIT_REPOSITORY_HOMEPAGE) {
    packageJsonData.homepage = nspData.NSP_GIT_REPOSITORY_HOMEPAGE;
  }

  if (nspData.NSP_REPOSITORY_REMOTE) {
    packageJsonData.repository = {
      type: "git",
      url: nspData.NSP_REPOSITORY_REMOTE
    };
  }

  if (nspData.NSP_ISSUES) {
    packageJsonData.bugs = {
      url: nspData.NSP_ISSUES
    };
  }

  _fs["default"].writeFileSync(packageJsonFile, JSON.stringify(packageJsonData, null, "\t"));

  var ep = contextDir + 'src/' + nspData.NSP_APP_ENTRY_POINT;

  if (!_fs["default"].existsSync(ep)) {
    _nodeCommandManager.console.info('Creating ' + nspData.NSP_APP_ENTRY_POINT + ' entry point');

    _fs["default"].writeFileSync(ep, '');
  }
}