"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  '.babelrc': "{\n    \"presets\": [\n        [\n            \"@babel/preset-env\",\n            {\n                \"useBuiltIns\": \"entry\",\n                \"corejs\": 3\n            }\n        ]\n    ],\n    \"plugins\": [\n        [\n            \"@babel/plugin-proposal-private-methods\",\n            {\n                \"loose\": true\n            }\n        ],\n        [\n            \"@babel/plugin-proposal-class-properties\",\n            {\n                \"loose\": true\n            }\n        ]\n    ]\n}",
  '.gitignore': "node_modules\n/config.local.json",
  'config.json': "{\n  \"NSP_PACKAGE_VERSION\": \"1.0.0\",\n  \"NSP_USERNAME\": \"\",\n  \"NSP_PACKAGE_LICENSE\": \"GPL-3.0-or-later\",\n  \"NSP_PACKAGE_KEYWORDS\": \"comma,separated,keywords\",\n  \"NSP_PACKAGE_PRIVATE\": false,\n  \"NSP_APP_ENTRY_POINT\": \"index.js\",\n  \"NSP_PASSWORD\": \"\",\n  \"NSP_EMAIL\": \"\",\n  \"NSP_PACKAGE_DESCRIPTION\": \"your package description\",\n  \"NSP_SCOPED_PACKAGE\": true,\n  \"NSP_SCOPE_NAME\": \"~\",\n  \"NSP_GIT_REPOSITORY_HOMEPAGE\": \"~\",\n  \"NSP_ISSUES\": \"~\",\n  \"NSP_REPOSITORY_REMOTE\": \"~\"\n}"
};
exports["default"] = _default;