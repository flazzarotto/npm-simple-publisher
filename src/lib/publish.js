import fs from "fs";
import {build} from "./build"
import prompt from 'prompt-async'
import {interactiveShell, updateVersion, getVersion, console} from "@kebab-case/node-command-manager"
import {generatePackageJson} from "./generatePackageJson"
import {exec} from "child_process"
import {arrayCombine} from "./arrayCombine";

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
        type: 'list, string',
        short: 'p',
        default: ['npm', 'git'],
        description: 'Publish only on listed package managers - only npm|git available but you\'ll be able to add any ' +
            'hook of your own in version 1.3 using config.json\n'
        +'Default: npm|git',
        example: "'kc-nps publish --publish-on=npm --publish-on=git or 'kc-nps -p npm -p git'"
    },

]

export const publishMod = {
    mod: 'publish',
    description: 'build and publish to npm',
    options: publishOptions,
    exec: publish
}

export async function publish(fileDir, contextDir, args, previous) {

    // TODO in version 1.3 .filter() must return false if: (no valid hook provided AND !== npm|git)
    let platforms = (args.options['publish-on'] || ['npm', 'git']).filter(p => p.replace(/\s+/, '').length)

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

    if (args.options['update-version']) {
        version = updateVersion(args.options['update-version'])
    }


    let prompter = `Are you sure you want to publish your package in version ${version} on `
        +`${Object.keys(platforms).join('|')}? (yes/no)`

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

    const nspData = JSON.parse(fs.readFileSync(contextDir + 'config.local.json').toString())

    await interactiveShell('npm', ['login'], {
        username: nspData.NSP_USERNAME,
        password: nspData.NSP_PASSWORD,
        emailthisispublic: nspData.NSP_EMAIL
    })

    let commitMessage = args.options['commit-message'] ?? `version ${version}`

    if (!platforms.git) {
        console.info('Publish on git skipped')
    } else if (args.options['update-version'] || args.options['commit-message']) {
        if (args.options['update-version']) {
            nspData.NSP_PACKAGE_VERSION = version
            fs.writeFileSync(contextDir + 'config.local.json', JSON.stringify(nspData, null, "\t"))
            console.info('Updating version to ' + version)
            generatePackageJson(fileDir, contextDir)
        }
        if (nspData.NSP_REPOSITORY_SSH_REMOTE) {
            console.info(`Pushing commit ${commitMessage} to remote`)
            exec(`git add . && git commit -m "${commitMessage}" && git push`)
            if (args.options['update-version']) {
                console.info('Pushing new tag to git remote')
                let tagMessage = args.options['tag-message'] ?? `version ${version}`
                exec(`git tag -a v${version} -m "${tagMessage}" && git push && git push --tags`)
            }
        }
    }

    // TODO in version 1.3 it should remain **after** other hooks
    if (!platforms.npm) {
        console.info('Publish on npm skipped')
        return
    }

    const publishArgs = ['publish']
    if (!nspData.NSP_PACKAGE_PRIVATE) {
        publishArgs.push('--access=public')
    }

    console.info(`Ready to publish ${nspData.NSP_PACKAGE_PRIVATE ? 'private' : 'public'} package to npm.`)

    let readmeData
    try {
        readmeData = fs.readFileSync(contextDir + 'README.md').toString()
    } catch (e) {
        readmeData = `# ${nspData.NSP_PACKAGE_NAME}
Here be documentation soon`
    }

    const poweredBy1 = `
-----------------------------------------
## Powered by @kebab-case/npm-simple-publisher`

    const poweredBy2 = `

This package has been brought to you by **npm-simple-publisher**

This little nodejs command-line script allows you to easily compile and publish node **and** es6 compliant code 
packages to npm. Init your project with minimal babel configuration for es6, compile to cjs and 
publish to npm with only two commands.

Try it now:

\`\`\`shell script
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
\`\`\`

Basically, that's all!

Find on npm: https://www.npmjs.com/package/@kebab-case/npm-simple-publisher`

    let index = readmeData.indexOf(poweredBy1)

    readmeData = readmeData.substr(0, (index > -1) ? index : readmeData.length)
        .replace(/\n+$/g, "\n")

    readmeData += "\n" + poweredBy1 + poweredBy2

    fs.writeFileSync(contextDir + 'README.md', readmeData)

    await interactiveShell('npm', publishArgs, null, false)
}
