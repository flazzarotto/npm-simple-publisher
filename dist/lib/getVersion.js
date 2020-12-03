"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = void 0;

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var version;
exports.version = version;

try {
  exports.version = version = JSON.parse(_fs["default"].readFileSync(__dirname + '/../../package.json').toString()).version;
} catch (e) {
  exports.version = version = '1.0.0';
}