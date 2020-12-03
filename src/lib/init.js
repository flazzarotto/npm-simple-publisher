import fs from "fs";
import prompt from "prompt";
import {parseBoolean} from "./parseBoolean";
import {exec} from "child_process";
import {package as generatePackageJson} from "./package";

export const initOptions = [{
    name: 'force',
    short: 'f',
    type: 'boolean',
    description: 'Force file override (if project not empty)',
    example: "'kc-nps-init --force' or 'script -f'"
}]

export const initMod = {
    mod: 'init',
    description: 'Initialize project',
    options: initOptions
}

export function init(dir, args) {
    const {
        force = false
    } = args.options

    const files = [
        '.babelrc',
        '.gitignore',
        'config.json',
        // 'package.json'
    ]

    for (let file of files) {
        const targetFile = (file !== 'config.json') ? ('./' + file) : './config.local.json'
        const sourceFile = dir + file

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

                const defaultConfig = JSON.parse(fs.readFileSync(sourceFile).toString())

                const properties = {}
                for (let name in defaultConfig) {
                    properties[name] = {default: defaultConfig[name]}
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
                        NSP_PACKAGE_NAME: fs.realpathSync('.').replace(/^.*[\\\/]/, '')
                    }

                    nspData.NSP_PACKAGE_PRIVATE = parseBoolean(nspData.NSP_PACKAGE_PRIVATE)
                    nspData.NSP_SCOPED_PACKAGE = parseBoolean(nspData.NSP_SCOPED_PACKAGE)

                    for (let prop in nspData) {
                        if (nspData[prop] === '~') {
                            nspData[prop] = null
                        }
                    }

                    let github = isGithub(nspData.NSP_GIT_REPOSITORY_HOMEPAGE)
                    if (github) {
                        if (!nspData.NSP_ISSUES) {
                            nspData.NSP_ISSUES = generateGithubIssues(github)
                        }
                        if (!nspData.NSP_REPOSITORY_REMOTE) {
                            nspData.NSP_REPOSITORY_REMOTE = generateGithubRemote(github)
                        }
                    }

                    done(JSON.stringify(nspData, null, "\t"));

                    (async function () {
                        generatePackageJson(dir)
                        if (!fs.existsSync('.git')) {
                            console.info('Init git repository')
                            await exec('git init')
                        }
                        await exec('yarn add -D @babel/preset-env @babel/core @babel/cli && yarn install')
                    })()
                })

                break
            default:
                done(fs.readFileSync(sourceFile))
                break
        }
    }
}


const githubRegexp = /^https:\/\/github.com\/([^\\]+)\/([^\\]+)$/

// 1 => username, 2 => repo name
function isGithub(url) {
    return url && {}.prototype.toString.call(url).match(githubRegexp)
}

function generateGithubRemote(parsedGithubRepoHomepage) {
    return parsedGithubRepoHomepage[0].replace(/\/$/, '') + '.git'
}

function generateGithubIssues(parsedGithubRepoHomepage) {
    return parsedGithubRepoHomepage[0].replace(/\/$/, '') + '/issues'
}
