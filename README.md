@kebab-case/npm-simple-publisher
================================

This little nodejs command-line script allows you to easily compile and publish node **and** es6 compliant code 
packages to npm. Init your project with minimal babel configuration for es6, compile to cjs and 
publish to npm with only two commands.

### INSTALLATION
This package requires `yarn` to behave correctly. 

```shell script
# install yarn
sudo apt install yarn
# or (deprecated)
sudo npm install -g yarn

# TODO install globally
sudo npm install -g @kebab-case/npm-simple-publisher
```

### HOW TO

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
    "NSP_PACKAGE_DESCRIPTION": "your package description",
    "NSP_PACKAGE_KEYWORDS": "comma,separated,keywords",
    "NSP_PACKAGE_LICENSE": "license to use - default: MIT",
    "NSP_PACKAGE_VERSION": "default: 1.0.0",
    "NSP_PACKAGE_PRIVATE": "true|false", 
    "NSP_SCOPED_PACKAGE": "true|false: use true to scope package as @username/package-name",
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
  
  You shall modify LICENSE file by replacing some generic fields (<year>, <author>, <program>, and so on) by their
  literal values.
  
  P.S. Default package name will be `your-project-name` folder name, but it can be changed in ```config.local.json```.
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
  # override default git commit message
  kc-nps publish --commit-message="my commit message"
  kc-nps publish -m "my commit message"
  # override default git tag message
  kc-nps publish --tag-message="my tag message"
  kc-nps publish -v="my tag message"
  # use custom publish hooks - see detailed help about using hooks here after
  kc-nps publish --publish-on=hook1 --publish-on=hook2
  kc-nps publish --p=hook1 --p=hook2
  # publish a patch of current version instead of new version (required if --update-version not provided)
  kc-nps publish --patch
  ```
  
### PUBLISHING HOOKS
You can define your own publishing hooks, which will be executed after `git push` (if configured) and before
`npm publish`. Each hook is a command-line of your choice with any arguments you want.
To do so:
1. Add your own hook either in `./config.json` (if you want to version your hooks), either in `./config.local.json`
(if you don't). Format of hooks field:
```json
{
  "NSP_HOOKS": {
    "hook-name": [
      "command-name",
      ["list of arguments"],
      {
        "prompt_question1": "answer to prompt_question1"
      },
      "interactive script (true|false)",
      null,
      [
        "hidden_field1 (should match any of prompt_question)"
      ]
    ]
  }
}
```
2. Hooks rely on `@kebab-case/node-command-manager/interactiveShell` to be executed.
To get more help about `interactiveShell`, please visit https://www.npmjs.com/package/@kebab-case/node-command-manager#interactive-shell
Note that you can define hooks with blank / undefined entries (like passwords), so you can version it; if you do so,
you will be prompted values for these.
3. Don't modify the null field if you don't exactly know what you are doing
4. `prompt_questions` and `hidden_fields` can use regex syntax to match your command prompt.
5. Use `kc-nps publish -p hook-name1 -p hook-name2 ...` to use your hooks. If you do so, you will have
to specify **every** hook you want to use, even `git` and `npm`, or they'll simply be skipped.
You can add a `script` entry in `package.json` to avoid typing all that hooks every single time :
```json
{
  "scripts": {
    // bunch of scripts
    "kn-publish": "kc-nps publish -p npm -p git -p my hook"
  }
}
``` 
This way you can publish more quickly using `yarn kn-publish [other publish args]`. 

### FURTHER HELP

Type `kc-nsp --help` to get help on all available commands, and `kc-nsp [module] --help` for further help on a
specific one. 

### DEPENDANCIES

- argv
- core-js
- fs 
- prompt-async
- request
- @kebab-case/node-command-manager


-----------------------------------------
## Powered by @kebab-case/npm-simple-publisher

This package has been brought to you by **npm-simple-publisher**

This little nodejs command-line script allows you to easily compile and publish node **and** es6 compliant code 
packages to npm. Init your project with minimal babel configuration for es6, compile to cjs and 
publish to npm with only two commands.

Try it now:

```shell script
sudo apt install yarn
sudo npm install -g @kebab-case/npm-simple-publisher
mkdir my_project
cd my_project
# getting help about command
kc-nsp -h # list of command modules
kc-nsp init -h # and so on
# getting started
kc-nsp init -f # create project 
# ... do things in my_project/src, using proposed build or your own (not npm-friendly)
kc-nsp publish -t M|m|r # publish new Major / minor version or revision
```

Basically, that's all!

Find on npm: https://www.npmjs.com/package/@kebab-case/npm-simple-publisher