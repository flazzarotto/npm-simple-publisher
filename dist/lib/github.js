"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isGithub = isGithub;
exports.generateGithubHomepage = generateGithubHomepage;
exports.generateGithubIssues = generateGithubIssues;
exports.generateGithubSshRemote = generateGithubSshRemote;
var githubRegexp = /^https:\/\/github.com\/([^\\]+)\/([^\\]+)$/; // 1 => username, 2 => repo name

function isGithub(url) {
  return url && (url !== null && url !== void 0 ? url : '').match(githubRegexp);
}

function generateGithubHomepage(parsedGithubRepoHomepage) {
  return parsedGithubRepoHomepage[0].replace(/\/$/, '') + '.git';
}

function generateGithubIssues(parsedGithubRepoHomepage) {
  return parsedGithubRepoHomepage[0].replace(/\/$/, '') + '/issues';
}

function generateGithubSshRemote(parsedGithubRepoHomepage) {
  return "git@github.com:".concat(parsedGithubRepoHomepage[1], "/").concat(parsedGithubRepoHomepage[2], ".git");
}