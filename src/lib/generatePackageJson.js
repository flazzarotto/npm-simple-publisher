import fs from "fs";
import fileData from '../data'
import {console} from '@kebab-case/node-command-manager'

export const packageOptions = []

export const packageMod = {
    mod: 'generate-pj',
    description: 'Generate packageJson.json from config.local.json',
    options: packageOptions,
    exec: generatePackageJson
}

export function generatePackageJson(fileDir, contextDir, args) {

    let packageJsonFile = contextDir+'package.json'

    console.info('Adding package.json settings')

    let packageJsonData
    try {
        packageJsonData = fs.readFileSync(packageJsonFile).toString()
    } catch (e) {
        console.warn('Creating a new package.json')
        packageJsonData = '{}'
    }

    let nspData = {
        ...JSON.parse(fileData['config.json']),
        ...JSON.parse(fs.readFileSync('config.local.json').toString())
    }

    packageJsonData = {
        ...JSON.parse(packageJsonData),
        name: (nspData.NSP_SCOPED_PACKAGE ? (
            '@'+(nspData.NSP_SCOPE_NAME ?? nspData.NSP_USERNAME).replace(/(^@)|(\/$)/g,'')+'/'
        ):'') + nspData.NSP_PACKAGE_NAME,
        version: nspData.NSP_PACKAGE_VERSION,
        description: nspData.NSP_PACKAGE_DESCRIPTION,
        author: nspData.NSP_USERNAME,
        main: './dist/' + nspData.NSP_APP_ENTRY_POINT,
        module: './src/' + nspData.NSP_APP_ENTRY_POINT,
        license: nspData.NSP_PACKAGE_LICENSE,
        keywords: nspData.NSP_PACKAGE_KEYWORDS.split(',').map(x => x.replace(/(^\s)|(\s$)/g, '')),
        private: nspData.NSP_PACKAGE_PRIVATE,
        scripts: packageJsonData.scripts || {
            build: "rm -rf dist && babel src -d dist && chmod +x ./dist/*.js"
        },
        eslintConfig: packageJsonData.eslintConfig || {
            "root": true,
            "env": {
                "node": true
            },
            "extends": [
                "eslint:recommended"
            ],
            "parserOptions": {
                "parser": "babel-eslint"
            },
            "rules": {}
        },
    }

    if (nspData.NSP_GIT_REPOSITORY_HOMEPAGE) {
        packageJsonData.homepage = nspData.NSP_GIT_REPOSITORY_HOMEPAGE
    }

    if (nspData.NSP_REPOSITORY_REMOTE) {
        packageJsonData.repository = {
            type: "git",
            url: nspData.NSP_REPOSITORY_REMOTE
        }
    }

    if (nspData.NSP_ISSUES) {
        packageJsonData.bugs = {
            url: nspData.NSP_ISSUES
        }
    }

    fs.writeFileSync(
        packageJsonFile,
        JSON.stringify(packageJsonData, null, "\t")
    )
}
