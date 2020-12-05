"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  "NSP_PACKAGE_VERSION": {
    "default": "1.0.0",
    description: 'Your package version'
  },
  "NSP_USERNAME": {
    "default": "",
    description: "Your npm username - please create a npm account if you don't have one"
  },
  "NSP_PACKAGE_LICENSE": {
    "default": "MIT"
  },
  "NSP_PACKAGE_KEYWORDS": {
    description: "keywords (comma,separated)",
    "default": ""
  },
  "NSP_PACKAGE_PRIVATE": {
    description: "Is this package private (false - free | true - premium)",
    "default": false
  },
  "NSP_APP_ENTRY_POINT": {
    description: "Your js entrypoint: src/",
    "default": "index.js"
  },
  "NSP_PASSWORD": {
    description: "Your npm password",
    "default": "",
    hidden: true
  },
  "NSP_EMAIL": {
    description: "Your public npm email",
    "default": ""
  },
  "NSP_PACKAGE_DESCRIPTION": {
    description: "Your package description",
    "default": ""
  },
  "NSP_SCOPED_PACKAGE": {
    description: "Must this package be scoped ?",
    "default": true
  },
  "NSP_SCOPE_NAME": {
    description: "Scope name (if left blank, @username)",
    "default": "~"
  },
  "NSP_REPOSITORY_REMOTE": {
    description: "Your github (or other git package manager) https URL",
    "default": "~"
  },
  "NSP_GIT_REPOSITORY_HOMEPAGE": {
    description: "Your project homepage - leave blank to use github project page",
    "default": "~"
  },
  "NSP_ISSUES": {
    description: "Your bugtracker (leave blank if you want to use your default github issues page)",
    "default": "~"
  }
};
exports["default"] = _default;