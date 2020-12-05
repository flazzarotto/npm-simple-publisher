"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.publish = publish;
exports.publishMod = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _build = require("./build");

var _promptAsync = _interopRequireDefault(require("prompt-async"));

var _nodeCommandManager = require("@kebab-case/node-command-manager");

var _generatePackageJson = require("./generatePackageJson");

var _child_process = require("child_process");

var _arrayCombine = require("./arrayCombine");

var _updateReadme = require("./updateReadme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var version = (0, _nodeCommandManager.getVersion)('.');
var publishOptions = [{
  name: 'update-version',
  type: 'string',
  "short": 't',
  description: 'Add a new (r)evision, (m)inor  or (M)ajor version',
  example: "'kc-nps publish --updateVersion=%s' or 'kc-nps publish -t %s' with %s in (M,m,r)"
}, {
  name: 'skip-build',
  type: 'boolean',
  "short": 's',
  description: 'Skip build',
  example: "'kc-nps publish --skip-build' or 'kc-nps publish -s'"
}, {
  name: 'yes',
  type: 'boolean',
  "short": 'y',
  description: 'Publish without confirm',
  example: "'kc-nps publish --yes' or 'kc-nps publish -y'"
}, {
  name: 'commit-message',
  type: 'string',
  "short": 'm',
  description: 'Modify commit message',
  example: "'kc-nps publish --commit-message=\"This is my ne version !\"' or 'kc-nps publish -m \"new version available\"'"
}, {
  name: 'tag-message',
  type: 'string',
  "short": 'v',
  description: 'Modify version message',
  example: "'kc-nps publish --tag-message=\"This is my ne version !\"' or 'kc-nps publish -v \"new version available\"'"
}, {
  name: 'publish-on',
  type: 'list',
  "short": 'p',
  description: 'Publish only on listed package managers - only npm|git available but you\'ll be able to add any ' + 'hook of your own in version 1.3 using config.json\n' + 'Default: npm|git',
  example: "'kc-nps publish --publish-on=npm --publish-on=git or 'kc-nps -p npm -p git'"
}, {
  name: 'patch',
  type: 'boolean',
  description: 'Publish a version patch instead of a new version',
  example: "'kc-nps publish --patch'"
}];
var publishMod = {
  mod: 'publish',
  description: 'build and publish to npm',
  options: publishOptions,
  exec: publish
};
exports.publishMod = publishMod;

function publish(_x, _x2, _x3, _x4) {
  return _publish.apply(this, arguments);
}

function _publish() {
  _publish = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(fileDir, contextDir, args, previous) {
    var _args$options$commit;

    var nspData, configuredHooks, platforms, yes, prompted, prompter, result, response, commitMessage, _args$options$tagMes, tagMessage, hookName, hook, publishArgs;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nspData = JSON.parse(_fs["default"].readFileSync(contextDir + 'config.local.json').toString());

            try {
              configuredHooks = JSON.parse(_fs["default"].readFileSync(contextDir + 'config.json').toString()).NSP_HOOKS;
            } catch (e) {
              configuredHooks = {};
            }

            nspData.NSP_HOOKS = _objectSpread(_objectSpread({}, configuredHooks), nspData.NSP_HOOKS || {}); // TODO in version 1.3 .filter() must return false if: (no valid hook provided AND !== npm|git)

            platforms = (args.options['publish-on'] || ['npm', 'git']).filter(function (p) {
              if (p === 'npm' || p === 'git') {
                return true;
              }

              if (!p.replace(/\s+/, '').length) {
                _nodeCommandManager.console.error('Hook name cannot be empty');

                return false;
              }

              if (!nspData.NSP_HOOKS[p]) {
                _nodeCommandManager.console.error("Hook ".concat(p, " not found in config.json or config.local.json"));

                return false;
              }

              return true;
            });

            if (platforms.length) {
              _context.next = 7;
              break;
            }

            _nodeCommandManager.console.error('No package manager to publish on, please provide one at least or leave the option `publish-on`' + ' blank to publish on npm (and git if configured)');

            return _context.abrupt("return");

          case 7:
            platforms = (0, _arrayCombine.arrayCombine)(platforms, new Array(platforms.length).fill(true));

            if (args.options['skip-build']) {
              _context.next = 12;
              break;
            }

            _nodeCommandManager.console.info('Running build');

            _context.next = 12;
            return (0, _build.build)(fileDir, contextDir);

          case 12:
            yes = args.options.yes;
            prompted = yes || false;

            if (!(args.options['patch'] && args.options['update-version'])) {
              _context.next = 17;
              break;
            }

            _nodeCommandManager.console.error('--patch option cannot be used along with --update-version ; please choose update OR patch');

            return _context.abrupt("return");

          case 17:
            if (args.options['update-version']) {
              version = (0, _nodeCommandManager.updateVersion)(args.options['update-version']);
            }

            prompter = "Are you sure you want to publish your package in ".concat(args.options.patch ? ' patched' : '', " ") + "version ".concat(version, " on ").concat(Object.keys(platforms).join('|'), "? (yes/no)");

          case 19:
            if (prompted) {
              _context.next = 30;
              break;
            }

            _context.next = 22;
            return _promptAsync["default"].get(prompter);

          case 22:
            result = _context.sent;
            response = Object.values(result)[0];

            if (!(!(yes = response === 'yes') && response !== 'no')) {
              _context.next = 27;
              break;
            }

            prompter = 'Please enter `yes` or `no`';
            return _context.abrupt("continue", 19);

          case 27:
            prompted = true;
            _context.next = 19;
            break;

          case 30:
            if (yes) {
              _context.next = 32;
              break;
            }

            return _context.abrupt("return");

          case 32:
            _context.next = 34;
            return (0, _nodeCommandManager.interactiveShell)('npm', ['login'], {
              username: nspData.NSP_USERNAME,
              password: nspData.NSP_PASSWORD,
              emailthisispublic: nspData.NSP_EMAIL
            });

          case 34:
            (0, _updateReadme.updateReadme)(contextDir, nspData);
            commitMessage = (_args$options$commit = args.options['commit-message']) !== null && _args$options$commit !== void 0 ? _args$options$commit : "version ".concat(version);

            if (!platforms.git) {
              _nodeCommandManager.console.info('Publish on git skipped');
            } else if (args.options['patch'] || args.options['update-version'] || args.options['commit-message']) {
              if (args.options['update-version'] || args.options['patch']) {
                nspData.NSP_PACKAGE_VERSION = version + (args.options['patch'] ? ' ' : '');

                _fs["default"].writeFileSync(contextDir + 'config.local.json', JSON.stringify(nspData, null, "\t"));

                _nodeCommandManager.console.info((args.options['patch'] ? 'Patching version ' : 'Updating version to ') + version);

                (0, _generatePackageJson.generatePackageJson)(fileDir, contextDir);
              }

              if (nspData.NSP_REPOSITORY_SSH_REMOTE) {
                _nodeCommandManager.console.info("Pushing commit ".concat(commitMessage, " to remote"));

                (0, _child_process.exec)("git add . && git commit -m \"".concat(commitMessage, "\" && git push"));

                if (args.options['update-version']) {
                  _nodeCommandManager.console.info('Pushing new tag to git remote');

                  tagMessage = (_args$options$tagMes = args.options['tag-message']) !== null && _args$options$tagMes !== void 0 ? _args$options$tagMes : "version ".concat(version);
                  (0, _child_process.exec)("git tag -a v".concat(version, " -m \"").concat(tagMessage, "\" && git push && git push --tags"));
                }
              }
            }

            _context.t0 = regeneratorRuntime.keys(nspData.NSP_HOOKS);

          case 38:
            if ((_context.t1 = _context.t0()).done) {
              _context.next = 55;
              break;
            }

            hookName = _context.t1.value;
            _context.prev = 40;

            if (platforms[hookName]) {
              _context.next = 44;
              break;
            }

            _nodeCommandManager.console.warn("Publishing to ".concat(hookName, " skipped."));

            return _context.abrupt("continue", 38);

          case 44:
            _nodeCommandManager.console.info("Publishing to ".concat(hookName, "..."));

            hook = nspData.NSP_HOOKS[hookName];
            _context.next = 48;
            return _nodeCommandManager.interactiveShell.apply(void 0, _toConsumableArray(hook));

          case 48:
            _context.next = 53;
            break;

          case 50:
            _context.prev = 50;
            _context.t2 = _context["catch"](40);

            _nodeCommandManager.console.error(_context.t2);

          case 53:
            _context.next = 38;
            break;

          case 55:
            if (platforms.npm) {
              _context.next = 58;
              break;
            }

            _nodeCommandManager.console.info('Publish on npm skipped');

            return _context.abrupt("return");

          case 58:
            publishArgs = ['publish'];

            if (!nspData.NSP_PACKAGE_PRIVATE) {
              publishArgs.push('--access=public');
            }

            _nodeCommandManager.console.info("Ready to publish ".concat(nspData.NSP_PACKAGE_PRIVATE ? 'private' : 'public', " package to npm."));

            if (!args.options.patch) {
              _context.next = 64;
              break;
            }

            _context.next = 64;
            return (0, _nodeCommandManager.interactiveShell)('npm', ['version', 'patch'], null, false);

          case 64:
            _context.next = 66;
            return (0, _nodeCommandManager.interactiveShell)('npm', publishArgs, null, false);

          case 66:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[40, 50]]);
  }));
  return _publish.apply(this, arguments);
}