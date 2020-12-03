"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.mods = void 0;

var _nodeCommandManager = require("@kebab-case/node-command-manager");

var _init = require("./lib/init");

var _generatePackageJson = require("./lib/generatePackageJson");

var _build = require("./lib/build");

var _publish = require("./lib/publish");

var mods = [_init.initMod, _generatePackageJson.packageMod, _build.buildMod, _publish.publishMod]; // TODO add Command repository

exports.mods = mods;
var npmSimplePublisherCommand = new _nodeCommandManager.CommandManager((0, _nodeCommandManager.getVersion)(__dirname + '/../'));
var cmd = npmSimplePublisherCommand.newCommand({
  mods: mods
});
var _default = cmd;
exports["default"] = _default;