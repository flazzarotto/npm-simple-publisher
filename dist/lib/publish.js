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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
  type: 'list, string',
  "short": 'p',
  "default": ['npm', 'git'],
  description: 'Publish only on listed package managers - only npm|git available but you\'ll be able to add any ' + 'hook of your own in version 1.3 using config.json\n' + 'Default: npm|git',
  example: "'kc-nps publish --publish-on=npm --publish-on=git or 'kc-nps -p npm -p git'"
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

    var platforms, yes, prompted, prompter, result, response, nspData, commitMessage, _args$options$tagMes, tagMessage, publishArgs, readmeData, poweredBy1, poweredBy2, index;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // TODO in version 1.3 .filter() must return false if: (no valid hook provided AND !== npm|git)
            platforms = (args.options['publish-on'] || ['npm', 'git']).filter(function (p) {
              return p.replace(/\s+/, '').length;
            });

            if (platforms.length) {
              _context.next = 4;
              break;
            }

            _nodeCommandManager.console.error('No package manager to publish on, please provide one at least or leave the option `publish-on`' + ' blank to publish on npm (and git if configured)');

            return _context.abrupt("return");

          case 4:
            platforms = (0, _arrayCombine.arrayCombine)(platforms, new Array(platforms.length).fill(true));

            if (args.options['skip-build']) {
              _context.next = 9;
              break;
            }

            _nodeCommandManager.console.info('Running build');

            _context.next = 9;
            return (0, _build.build)(fileDir, contextDir);

          case 9:
            yes = args.options.yes;
            prompted = yes || false;

            if (args.options['update-version']) {
              version = (0, _nodeCommandManager.updateVersion)(args.options['update-version']);
            }

            prompter = "Are you sure you want to publish your package in version ".concat(version, " on ") + "".concat(Object.keys(platforms).join('|'), "? (yes/no)");

          case 13:
            if (prompted) {
              _context.next = 24;
              break;
            }

            _context.next = 16;
            return _promptAsync["default"].get(prompter);

          case 16:
            result = _context.sent;
            response = Object.values(result)[0];

            if (!(!(yes = response === 'yes') && response !== 'no')) {
              _context.next = 21;
              break;
            }

            prompter = 'Please enter `yes` or `no`';
            return _context.abrupt("continue", 13);

          case 21:
            prompted = true;
            _context.next = 13;
            break;

          case 24:
            if (yes) {
              _context.next = 26;
              break;
            }

            return _context.abrupt("return");

          case 26:
            nspData = JSON.parse(_fs["default"].readFileSync(contextDir + 'config.local.json').toString());
            _context.next = 29;
            return (0, _nodeCommandManager.interactiveShell)('npm', ['login'], {
              username: nspData.NSP_USERNAME,
              password: nspData.NSP_PASSWORD,
              emailthisispublic: nspData.NSP_EMAIL
            });

          case 29:
            commitMessage = (_args$options$commit = args.options['commit-message']) !== null && _args$options$commit !== void 0 ? _args$options$commit : "version ".concat(version);

            if (!platforms.git) {
              _nodeCommandManager.console.info('Publish on git skipped');
            } else if (args.options['update-version'] || args.options['commit-message']) {
              if (args.options['update-version']) {
                nspData.NSP_PACKAGE_VERSION = version;

                _fs["default"].writeFileSync(contextDir + 'config.local.json', JSON.stringify(nspData, null, "\t"));

                _nodeCommandManager.console.info('Updating version to ' + version);

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
            } // TODO in version 1.3 it should remain **after** other hooks


            if (platforms.npm) {
              _context.next = 34;
              break;
            }

            _nodeCommandManager.console.info('Publish on npm skipped');

            return _context.abrupt("return");

          case 34:
            publishArgs = ['publish'];

            if (!nspData.NSP_PACKAGE_PRIVATE) {
              publishArgs.push('--access=public');
            }

            _nodeCommandManager.console.info("Ready to publish ".concat(nspData.NSP_PACKAGE_PRIVATE ? 'private' : 'public', " package to npm."));

            try {
              readmeData = _fs["default"].readFileSync(contextDir + 'README.md').toString();
            } catch (e) {
              readmeData = "# ".concat(nspData.NSP_PACKAGE_NAME, "\nHere be documentation soon");
            }

            poweredBy1 = "\n-----------------------------------------\n## Powered by @kebab-case/npm-simple-publisher";
            poweredBy2 = "\n\nThis package has been brought to you by **npm-simple-publisher**\n\nThis little nodejs command-line script allows you to easily compile and publish node **and** es6 compliant code \npackages to npm. Init your project with minimal babel configuration for es6, compile to cjs and \npublish to npm with only two commands.\n\nTry it now:\n\n```shell script\nsudo apt install yarn\nsudo npm install -g @kebab-case/npm-simple-publisher\nmkdir my_project\ncd my_project\n# getting help about command\nkc-nsp -h # list of command modules\nkc-nsp init -h # and so on\n# getting started\nkc-nsp init -f # create project \n# ... do things in my_project/src, using proposed build or your own (not npm-friendly)\nkc-nsp publish -t M|m|r # publish new Major / minor version or revision\n```\n\nBasically, that's all!\n\nFind on npm: https://www.npmjs.com/package/@kebab-case/npm-simple-publisher";
            index = readmeData.indexOf(poweredBy1);
            readmeData = readmeData.substr(0, index > -1 ? index : readmeData.length).replace(/\n+$/g, "\n");
            readmeData += "\n" + poweredBy1 + poweredBy2;

            _fs["default"].writeFileSync(contextDir + 'README.md', readmeData);

            _context.next = 46;
            return (0, _nodeCommandManager.interactiveShell)('npm', publishArgs, null, false);

          case 46:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _publish.apply(this, arguments);
}