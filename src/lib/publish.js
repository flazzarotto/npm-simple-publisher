import fs from "fs";
import {build} from "./build"
import prompt from 'prompt-async'
import {interactiveShell, updateVersion, getVersion, console} from "@kebab-case/node-command-manager"
import {generatePackageJson} from "./generatePackageJson"
import {exec} from "child_process"
import {arrayCombine} from "./arrayCombine";
import {updateReadme} from "./updateReadme";

let version = getVersion('.')

const publishOptions = [
    {
        name: 'update-version',
        type: 'string',
        short: 't',
        description: 'Add a new (r)evision, (m)inor  or (M)ajor version',
        example: "'kc-nps publish --updateVersion=%s' or 'kc-nps publish -t %s' with %s in (M,m,r)"
    },
    {
        name: 'skip-build',
        type: 'boolean',
        short: 's',
        description: 'Skip build',
        example: "'kc-nps publish --skip-build' or 'kc-nps publish -s'"
    },
    {
        name: 'yes',
        type: 'boolean',
        short: 'y',
        description: 'Publish without confirm',
        example: "'kc-nps publish --yes' or 'kc-nps publish -y'"
    },
    {
        name: 'commit-message',
        type: 'string',
        short: 'm',
        description: 'Modify commit message',
        example: "'kc-nps publish --commit-message=\"This is my ne version !\"' or 'kc-nps publish -m \"new version available\"'"
    },
    {
        name: 'tag-message',
        type: 'string',
        short: 'v',
        description: 'Modify version message',
        example: "'kc-nps publish --tag-message=\"This is my ne version !\"' or 'kc-nps publish -v \"new version available\"'"
    },
    {
        name: 'publish-on',
        type: 'list',
        short: 'p',
        description: 'Publish only on listed package managers - only npm|git available but you\'ll be able to add any ' +
            'hook of your own in version 1.3 using config.json\n'
            + 'Default: npm|git',
        example: "'kc-nps publish --publish-on=npm --publish-on=git or 'kc-nps -p npm -p git'"
    },
    {
        name: 'patch',
        type: 'boolean',
        description: 'Publish a version patch instead of a new version',
        example: "'kc-nps publish --patch'"
    },
    {
        name: 'deprecate-older-versions',
        type: 'string',
        short: 'd',
        description: 'Deprecates all older major versions.',
        example: "'kc-nps publish --deprecate=1' or 'kc-nps publish --d 2'"
    }

]

export const publishMod = {
    mod: 'publish',
    description: 'build and publish to npm',
    options: publishOptions,
    exec: publish
}

export async function publish(fileDir, contextDir, args) {

    const nspData = JSON.parse(fs.readFileSync(contextDir + 'config.local.json').toString())

    let configuredHooks
    try {
        configuredHooks = JSON.parse(fs.readFileSync(contextDir + 'config.json').toString()).NSP_HOOKS
    } catch (e) {
        configuredHooks = {}
    }
    nspData.NSP_HOOKS = {...configuredHooks, ...(nspData.NSP_HOOKS || {})}

    let platforms = (args.options['publish-on'] || ['npm', 'git']).filter(p => {
            if (p === 'npm' || p === 'git') {
                return true
            }
            if (!p.replace(/\s+/, '').length) {
                console.error('Hook name cannot be empty')
                return false
            }
            if (!nspData.NSP_HOOKS[p]) {
                console.error(`Hook ${p} not found in config.json or config.local.json`)
                return false
            }
            return true
        }
    )

    if (!platforms.length) {
        console.error('No package manager to publish on, please provide one at least or leave the option `publish-on`'
            + ' blank to publish on npm (and git if configured)')
        return
    }

    platforms = arrayCombine(platforms, new Array(platforms.length).fill(true))

    if (!args.options['skip-build']) {
        console.info('Running build')
        await build(fileDir, contextDir)
    }

    let yes = args.options.yes
    let prompted = yes || false

    if (args.options['patch'] && args.options['update-version']) {
        console.error('--patch option cannot be used along with --update-version ; please choose update OR patch')
        return
    }

    if (args.options['update-version']) {
        version = updateVersion(args.options['update-version'], '.')
    }

    let prompter = `Are you sure you want to publish your package in ${args.options.patch ? ' patched' : ''} `
        + `version ${version} on ${Object.keys(platforms).join('|')}? (yes/no)`

    while (!prompted) {
        let result = await prompt.get(prompter)
        let response = Object.values(result)[0]
        if (!(yes = response === 'yes') && response !== 'no') {
            prompter = 'Please enter `yes` or `no`'
            continue
        }
        prompted = true
    }
    if (!yes) {
        return
    }

    updateReadme(contextDir, nspData)

    let commitMessage = args.options['commit-message'] ?? `version ${version}` + (args.options['patch'] ? ' patched' : '')

    if (!platforms.git) {
        console.info('Publish on git skipped')
    } else if (args.options['patch'] ||
        args.options['update-version'] || args.options['commit-message']) {
        if (args.options['update-version'] || args.options['patch']) {
            nspData.NSP_PACKAGE_VERSION = version
            fs.writeFileSync(contextDir + 'config.local.json', JSON.stringify(nspData, null, "\t"))
            console.info((args.options['patch'] ? 'Patching version ' : 'Updating version to ') + version)
            generatePackageJson(fileDir, contextDir)
        }
        if (nspData.NSP_REPOSITORY_SSH_REMOTE) {
            console.info(`Pushing commit ${commitMessage} to remote`)
            await exec(`git add . && git commit -m "${commitMessage}" && git push`)
            if (args.options['update-version']) {
                console.info('Pushing new tag to git remote')
                let tagMessage = args.options['tag-message'] ?? `version ${version}`
                await exec(`git tag -a v${version} -m "${tagMessage}" && git push && git push --tags`)
            }
        }
    }

    for (let hookName in nspData.NSP_HOOKS) {
        try {
            if (!platforms[hookName]) {
                console.warn(`Publishing to ${hookName} skipped.`)
                continue
            }
            console.info(`Publishing to ${hookName}...`)
            let hook = nspData.NSP_HOOKS[hookName]
            await interactiveShell(...hook)
        } catch (e) {
            console.error(e)
        }
    }

    // FIXME /!\ must remain after other hooks - or use if
    if (!platforms.npm) {
        console.info('Publish on npm skipped')
        return
    }

    await interactiveShell('npm', ['login'], {
        username: nspData.NSP_USERNAME,
        password: nspData.NSP_PASSWORD,
        emailthisispublic: nspData.NSP_EMAIL
    })


    const publishArgs = ['publish']
    if (!nspData.NSP_PACKAGE_PRIVATE) {
        publishArgs.push('--access=public')
    }

    console.info(`Ready to publish ${nspData.NSP_PACKAGE_PRIVATE ? 'private' : 'public'} package to npm.`)

    if (args.options.patch) {
        await interactiveShell('npm', ['version', 'patch'], null, false)
    }
    else {
        await interactiveShell('npm', publishArgs, null, false)
    }
    
    let deprecate = args.options['deprecate-older-versions']

    if (deprecate.length) {
        deprecate = parseInt(deprecate)
        if (deprecate >= parseInt(version.split('.', 1))) {
            console.error('Cannot deprecate current or newer version, skipping deprecate.')
        } else {
            let packageName = ((nspData.NSP_SCOPED_PACKAGE
                ? (nspData.NSP_SCOPE_NAME ?? nspData.NSP_USERNAME).replace(/^@+/g,'')
                :'')+'/'+
            nspData.NSP_PACKAGE_NAME).replace(/\/+/g,'/')
            let message = 'Version no longer supported. Please upgrade to @latest'
            await interactiveShell('npm', ['deprecate', packageName+ '@0-' + deprecate, message])
            await interactiveShell('npm', ['deprecate', packageName+ '@1-' + deprecate, message])
        }
    } else {
        console.error('No valid version supplied, skipping deprecate command.')
    }

}
