export default {
    '.babelrc': `{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "entry",
                "corejs": 3
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-proposal-private-methods",
            {
                "loose": true
            }
        ],
        [
            "@babel/plugin-proposal-class-properties",
            {
                "loose": true
            }
        ]
    ]
}`,
    '.gitignore': `node_modules
/config.local.json`,
    'config.json': `{
  "NSP_PACKAGE_VERSION": "1.0.0",
  "NSP_USERNAME": "",
  "NSP_PACKAGE_LICENSE": "GPL-3.0-or-later",
  "NSP_PACKAGE_KEYWORDS": "comma,separated,keywords",
  "NSP_PACKAGE_PRIVATE": false,
  "NSP_APP_ENTRY_POINT": "index.js",
  "NSP_PASSWORD": "",
  "NSP_EMAIL": "",
  "NSP_PACKAGE_DESCRIPTION": "your package description",
  "NSP_SCOPED_PACKAGE": true,
  "NSP_SCOPE_NAME": "~",
  "NSP_GIT_REPOSITORY_HOMEPAGE": "~",
  "NSP_ISSUES": "~",
  "NSP_REPOSITORY_REMOTE": "~"
}`
}