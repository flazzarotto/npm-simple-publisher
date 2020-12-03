"use strict";

var _argv = _interopRequireDefault(require("argv"));

var _getVersion = require("./lib/getVersion");

var _init = require("./lib/init");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_argv["default"].version(_getVersion.version);

_argv["default"].mod({
  mod: 'init',
  description: 'Initialize project',
  options: _init.initOptions
});

var args = _argv["default"].run();

console.log(args); //
// const {
//     init = false
// } = args.options
//
// if (init) {
//     exec('node ./initCommand.js')
// }
// // ...
// else {
//     argv.help()
// }