"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  "presets": [["@babel/preset-env", {
    "useBuiltIns": "entry",
    "corejs": 3
  }]],
  "plugins": [["@babel/plugin-proposal-private-methods", {
    "loose": true
  }], ["@babel/plugin-proposal-class-properties", {
    "loose": true
  }]]
};
exports["default"] = _default;