@kebab-case/npm-simple-publisher
================================

This little nodejs command-line script allows you to easily compile and publish node **and** es6 compliant code 
packages to npm. Init your project with minimal babel configuration for es6, compile to cjs and 
publish to npm with only two commands.

## DEPENDANCIES & INSTALLATION
This package requires `yarn` to behave correctly. 

```shell script
# install yarn
sudo apt install yarn
# or (deprecated)
sudo npm install -g yarn

# TODO install globally
sudo npm install -g @kebab-case/npm-simple-publisher
```



## HOW TO

* First, create your new project `your-project-name` and a sub-folder `your-project-name/src` for your source
  code.
* Using terminal, navigate to your project root folder, i.e. `cd your-project-name`
* Enter the following command to init your project:
  ```shell script
  kc-nsp init
  ```
  You can re-run this command afterwards, but you will need to use the `-f` option to force overwrite of files.
* Enter prompted values. **~** stands for `null`. You can replace vars later in the newly created
  `config.local.json` with yours:
  ```json
  {
    "NSP_USERNAME": "your npm username",
    "NSP_PASSWORD": "your npm password",
    "NSP_EMAIL": "your public npm email",
    "NSP_PACKAGE_DESCRIPTION": "your packageJson description",
    "NSP_PACKAGE_KEYWORDS": "comma,separated,keywords",
    "NSP_PACKAGE_LICENSE": "license to use - default: GPL-3.0-or-later",
    "NSP_PACKAGE_VERSION": "default: 1.0.0",
    "NSP_PACKAGE_PRIVATE": "true|false", 
    "NSP_SCOPED_PACKAGE": "true|false: use true to scope packageJson as @username/packageJson-name",
    "NSP_SCOPE_NAME": "scope name - default: @username",
    "NSP_APP_ENTRY_POINT": "app entry point - relative to ./src directory - default: index.js",
    "NSP_REPOSITORY_HOMEPAGE": "full URL to your remote git repo homepage - default: null",
    "NSP_ISSUES": "full URL to your bug tracker - automatically defined if github homepage provided",
    "NSP_REPOSITORY_REMOTE": "full https URL to your remote .git - automatically defined if github homepage provided"
  }
  ```
  N.B.: this file is gitignored, so you can set your npm password confidently.
  
  You can find a list of supported licenses here after - your license field must exactly match a filename without
  extension:
  https://github.com/spdx/license-list-data/tree/master/text
  
  P.S. Default package name will be `your-project-name` name, but it can be changed in ```config.local.json```.
* You can now write es6 in your `./src` folder and set up your own settings in `package.json` and `.gitignore`.
* DO NOT forget to add your fantastic `README.md`!
* Ready to publish to npm ? Use the `kc-nsp publish` script!
  
  First, the `kc-nsp build` sub-command will create a `dist` folder will be created with cjs-compliant code, and your
  `src` entry point will be used as an es6 module. Your `package.json` will be modified accordingly
  (using `kc-nsp generate-pj` subcommand).
  
  You can use publish with following options:
  
  ```shell script
  # skip build
  kc-nsp publish --skip-build
  kc-nsp publish -s
  # update version
  kc-nsp publish --update-version=%s # with %s: M => new major version / m : new minor version / r : new revision
  kc-nsp publish -t %s
  # skip publish confirmation
  kc-nsp publish --yes
  kc-nsp publish -y
  ```

## FURTHER HELP

Type `kc-nsp --help` to get help on all available commands, and `kc-nsp [module] --help` for further help on a
specific one. 

## DEPENDANCIES

- argv
- core-js
- fs 
- prompt-async
- request
- @kebab-case/node-command-manager
-----------------------------------------
## Powered by @kebab-case/npm-simple-publisher

This package has been brought to you by [npm-simple-publisher](url=https://www.npmjs.com/package/@kebab-case/npm-simple-publisher)

This little nodejs command-line script allows you to easily compile and publish node **and** es6 compliant code 
packages to npm. Init your project with minimal babel configuration for es6, compile to cjs and 
publish to npm with only two commands.