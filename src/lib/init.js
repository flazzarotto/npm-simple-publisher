import fs from "fs";
import prompt from "prompt-async";
import {parseBoolean} from "./parseBoolean";
import {generatePackageJson as generatePackageJson} from "./generatePackageJson";
import {build} from "./build";
import {generateGithubIssues, generateGithubRemote, generateGithubSshRemote, isGithub} from "./github"
import fileData from "../data";

export const initOptions = [{
    name: 'force',
    short: 'f',
    type: 'boolean',
    description: 'Force file override (if project not empty)',
    example: "'kc-nps init --force' or 'script -f'"
}]

export const initMod = {
    mod: 'init',
    description: 'Initialize project',
    options: initOptions,
    exec: init
}

export function init(fileDir, contextDir, args) {
    const {
        force = false
    } = args.options

    const files = [
        '.babelrc',
        '.gitignore',
        'config.json',
        // 'packageJson.json'
    ]

    for (let file of files) {

        const targetFile = contextDir + ((file !== 'config.json') ? file : 'config.local.json')
        const sourceData = fileData[file]

        function done(data) {
            if (fs.existsSync(targetFile)) {
                if (fs.lstatSync(targetFile).isDirectory()) {
                    throw new Error('File ' + file + ' should not be a directory.')
                }
                if (!force) {
                    throw new Error('File ' + file + ' already present.')
                }
                console.warn('File ' + file + ' will be replaced with fresh one.')
            }
            fs.writeFileSync(targetFile, data)
        }

        switch (file) {
            case 'config.json':

                const defaultConfig = JSON.parse(sourceData)
                let actualConfig = {}

                if (fs.existsSync(targetFile)) {
                    actualConfig = JSON.parse(fs.readFileSync(targetFile).toString())
                }

                const properties = {}

                const nspData = {
                    ...defaultConfig,
                    ...actualConfig
                }

                for (let name in defaultConfig) {
                    properties[name] = {default: nspData[name] ?? '~'}
                    if (name === 'NSP_PASSWORD') {
                        properties[name].hidden = true
                    }
                }

                prompt.start()

                prompt.get({properties}, (err, result) => {
                    prompt.stop()
                    const del = []
                    for (let name in result) {
                        if (!{}.toString.call(result[name]).length) {
                            del.push(name)
                        }
                    }
                    for (let d of del) {
                        delete result[d]
                    }

                    const nspData = {
                        ...defaultConfig, ...result,
                        NSP_PACKAGE_NAME: fs.realpathSync(contextDir).replace(/^.*[\\\/]/, '')
                    }

                    nspData.NSP_PACKAGE_PRIVATE = parseBoolean(nspData.NSP_PACKAGE_PRIVATE)
                    nspData.NSP_SCOPED_PACKAGE = parseBoolean(nspData.NSP_SCOPED_PACKAGE)

                    for (let prop in nspData) {
                        if (nspData[prop] === '~') {
                            nspData[prop] = null
                        }
                    }

                    let github = isGithub(nspData.NSP_GIT_REPOSITORY_HOMEPAGE)

                    console.log(github)

                    if (github) {
                        if (!nspData.NSP_ISSUES) {
                            nspData.NSP_ISSUES = generateGithubIssues(github)
                        }
                        if (!nspData.NSP_REPOSITORY_REMOTE) {
                            nspData.NSP_REPOSITORY_REMOTE = generateGithubRemote(github)
                        }
                        if (!nspData.NSP_REPOSITORY_SSH_REMOTE) {
                            nspData.NSP_REPOSITORY_SSH_REMOTE = generateGithubSshRemote(github)
                        }
                    }

                    console.log(nspData)

                    done(JSON.stringify(nspData, null, "\t"));

                    (async function () {
                        generatePackageJson(fileDir, contextDir)
                        await build(fileDir, contextDir)
                    })()
                })

                break
            default:
                done(sourceData)
                break
        }
    }
}


