"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateReadme = updateReadme;

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function updateReadme(contextDir, nspData) {
  var readmeData;

  try {
    readmeData = _fs["default"].readFileSync(contextDir + 'README.md').toString();
  } catch (e) {
    readmeData = "# ".concat(nspData.NSP_PACKAGE_NAME, "\nHere be documentation soon");
  }

  var poweredBy1 = "\n-----------------------------------------\n## Powered by @kebab-case/npm-simple-publisher";
  var poweredBy2 = "\n\nThis package has been brought to you by **npm-simple-publisher**\n\nThis little nodejs command-line script allows you to easily compile and publish node **and** es6 compliant code \npackages to npm. Init your project with minimal babel configuration for es6, compile to cjs and \npublish to npm with only two commands.\n\nTry it now:\n\n```shell script\nsudo apt install yarn\nsudo npm install -g @kebab-case/npm-simple-publisher\nmkdir my_project\ncd my_project\n# getting help about command\nkc-nsp -h # list of command modules\nkc-nsp init -h # and so on\n# getting started\nkc-nsp init -f # create project \n# ... do things in my_project/src, using proposed build or your own (not npm-friendly)\nkc-nsp publish -t M|m|r # publish new Major / minor version or revision\n```\n\nBasically, that's all!\n\nFind on npm: https://www.npmjs.com/package/@kebab-case/npm-simple-publisher";
  var index = readmeData.indexOf(poweredBy1);
  readmeData = readmeData.substr(0, index > -1 ? index : readmeData.length).replace(/\n+$/g, "\n");
  readmeData += "\n" + poweredBy1 + poweredBy2;

  _fs["default"].writeFileSync(contextDir + 'README.md', readmeData);
}