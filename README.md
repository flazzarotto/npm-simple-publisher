@kebab-case/npm-simple-publisher
================================

This little nodejs command-line script allows you to easily compile and publish node **and** es6 compliant code 
 packages to npm.

## INSTALLATION
This package should be installed using `yarn`:

```shell script
# install yarn
sudo apt install yarn
# or
npm install -g yarn

# TODO install globally
# install package
yarn add -D @kebab-case/npm-simple-publisher
```

## HOW TO

* First, create your new project `your-project-name` and a subfolder `your-project-name/src` for your source
  code
* Using terminal, navigate to your project root folder, i.e. `cd your-project-name`
* Enter the following command to init your project:
  ```shell script
  yarn kc-nps-init
  ```
* Enter prompted values. **~** stands for ```null```. You can replace vars later in the newly created
  config.local.json with yours:
  ```json
  {
    "NSP_USERNAME": "your npm username",
    "NSP_PASSWORD": "your npm password",
    "NSP_EMAIL": "your public npm email",
    "NSP_PACKAGE_DESCRIPTION": "your package description",
    "NSP_PACKAGE_LICENSE": "license to use - default: GPL-3.0-or-later",
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
  N.B.: this file is gitignored so you can set your npm password confidently.
* You can now write es6 in your `./src` folder and set up your own settings in 
    ```package.json``` and ```.gitignore```.
* When ready, use the ```build``` script. A ```dist``` folder will be created with node-compliant js, and
a ```./index.js``` which export all from your ```src``` entry point. Your ```package.json``` will be
modified accordingly.
* Use the ```publish``` script when you're ready to publish your package to npm!