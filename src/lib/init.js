import fs from "fs";
import {parseBoolean} from "./parseBoolean";
import {generatePackageJson as generatePackageJson} from "./generatePackageJson";
import {build} from "./build";
import {generateGithubIssues, generateGithubHomepage, generateGithubSshRemote, isGithub} from "./github"
import fileData from "../data";
import {console, Prompt} from '@kebab-case/node-command-manager'

const prompt = new Prompt()

export const initOptions = [{
    name: 'force',
    short: 'f',
    type: 'boolean',
    description: 'Force file override (if project not empty)',
    example: "'kc-nps init --force' or 'script -f'"
}, {
    name: 'skip',
    short: 's',
    type: 'boolean',
    description: 'Skip existing files',
    example: "'kc-nps init --skip' or 'script -s'"
}, {
    name: 'update',
    short: 'u',
    type: 'boolean',
    description: 'Force package.json update (when --skip option is used)',
    example: "'kc-nps init --skip --update' or 'script -s -u'"
}]

export const initMod = {
    mod: 'init',
    description: 'Initialize project',
    options: initOptions,
    exec: init
}

export async function init(fileDir, contextDir, args) {

    if (!fs.existsSync(contextDir + 'src') || !fs.lstatSync(contextDir + 'src').isDirectory()) {
        if (!args.options.force) {
            console.error('This seems not to be a project directory, `src` dir is missing.'
                + ' Use init --force to create dir')
            return
        }
        try {
            fs.mkdirSync(contextDir + 'src')
        } catch (e) {
            console.error(e)
            return
        }
    }

    const {
        force = false,
        skip = false,
        update = false
    } = args.options

    const files = Object.keys(fileData)

    for (let file of files) {

        const targetFile = contextDir + ((file !== 'config.json') ? file : 'config.local.json')
        const sourceData = fileData[file]

        const done = function(data) {
            if (fs.existsSync(targetFile)) {
                if (fs.lstatSync(targetFile).isDirectory()) {
                    throw new Error('File ' + file + ' should not be a directory.')
                }
                if (skip) {
                    console.info('Skipping existing file ' + file + '.')
                    return
                }
                if (!force) {
                    throw new Error('File ' + file + ' already present. Use --force (-f) to override file or --skip (-s).')
                }
                console.warn('File ' + file + ' will be replaced with fresh one.')
            } else {
                console.info('Generating ' + file + '.')
            }
            fs.writeFileSync(targetFile, data)
        }

        const processConfigJson = async () => {
            let pJson = contextDir + 'package.json'

            if (fs.existsSync(pJson)) {
                if (skip && !update) {
                    console.info('package.json already present. Use --skip --update (-su) to update file.')
                    return
                }
            }

            let defaultConfig = JSON.parse(sourceData)
            let actualConfig = {}

            if (fs.existsSync(targetFile)) {
                actualConfig = JSON.parse(fs.readFileSync(targetFile).toString())
            }

            const properties = fileData.configProperties

            let nspData = {
                ...defaultConfig,
                ...actualConfig
            }

            for (let name in defaultConfig) {
                properties[name].default = nspData[name] ?? properties[name].default
            }

            console.info('Please fill in following values')
            console.warn('Note that password will NOT be stored outside of config.local.json which is a'
                + ' .gitignored file')
            console.warn('If you don\'t want to store your npm password in config.local.json leave field blank.' +
                ' You will have to type it when publishing.')

            const result = await prompt.call(properties);

            const del = []
            for (let name in result) {
                if (!{}.toString.call(result[name]).length) {
                    del.push(name)
                }
            }
            for (let d of del) {
                delete result[d]
            }

            nspData = {
                ...defaultConfig, ...result,
                NSP_PACKAGE_NAME: fs.realpathSync(contextDir).replace(/^.*[/]/, '')
            }

            nspData.NSP_PACKAGE_PRIVATE = parseBoolean(nspData.NSP_PACKAGE_PRIVATE)
            nspData.NSP_SCOPED_PACKAGE = parseBoolean(nspData.NSP_SCOPED_PACKAGE)

            for (let prop in nspData) {
                if (nspData[prop] === '~') {
                    nspData[prop] = null
                }
            }

            let github = isGithub(nspData.NSP_REPOSITORY_REMOTE)

            if (github) {
                if (!nspData.NSP_ISSUES) {
                    nspData.NSP_ISSUES = generateGithubIssues(github)
                }
                if (!nspData.NSP_GIT_REPOSITORY_HOMEPAGE) {
                    nspData.NSP_GIT_REPOSITORY_HOMEPAGE = generateGithubHomepage(github)
                }
                if (!nspData.NSP_REPOSITORY_SSH_REMOTE) {
                    nspData.NSP_REPOSITORY_SSH_REMOTE = generateGithubSshRemote(github)
                }
            }

            if (fs.existsSync(targetFile)) {
                fs.unlinkSync(targetFile)
            }

            done(JSON.stringify(nspData, null, "\t"))
            generatePackageJson(fileDir, contextDir)
        }

        switch (file) {
            case 'configProperties':
                break
            case 'config.json':
                await processConfigJson()
                break
            default:
                done(sourceData)
                break
        }
    }
    await build(fileDir, contextDir, {options: {license: true}})
    console.warn('Init done. Please ensure that all of `./config.local.json` data is valid.')
}


