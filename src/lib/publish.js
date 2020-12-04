import fs from "fs";
import {build} from "./build"
import prompt from 'prompt-async'
import {interactiveShell, updateVersion, getVersion, console} from "@kebab-case/node-command-manager"
import {generatePackageJson} from "./generatePackageJson"
import {exec} from "child_process"

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

]

export const publishMod = {
    mod: 'publish',
    description: 'build and publish to npm',
    options: publishOptions,
    exec: publish
}

export async function publish(fileDir, contextDir, args, previous) {

    if (!args.options['skip-build']) {
        console.info('Running build')
        await build(fileDir, contextDir)
    }

    let yes = args.options.yes
    let prompted = yes || false

    if (args.options['update-version']) {
        version = updateVersion(args.options['update-version'])
    }

    let prompter = `Are you sure you want to publish your package in version ${version} ? (yes/no)`

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

    if (args.options['update-version']) {
        nspData.NSP_PACKAGE_VERSION = version
        fs.writeFileSync(contextDir + 'config.local.json', JSON.stringify(nspData, null, "\t"))
        console.info('Updating version to ' + version)
        generatePackageJson(fileDir, contextDir)
        if (nspData.NSP_REPOSITORY_SSH_REMOTE) {
            console.info('Pushing new tag to git remote')
            exec(`git add . && git commit -m "version ${version}" && git tag -a v${version} -m `
                + `"version ${version}" && git push && git push --tags`)
        }
    }


    const publishArgs = ['publish']
    if (!nspData.NSP_PACKAGE_PRIVATE) {
        publishArgs.push('--access=public')
    }

    console.info(`Ready to publish ${nspData.NSP_PACKAGE_PRIVATE?'private':'public'} package to npm.`)

    let readmeData
    try {
         readmeData = fs.readFileSync(contextDir + 'README.md').toString()
    }
    catch(e) {
        readmeData = `# ${nspData.NSP_PACKAGE_NAME}
Here be documentation soon`
    }

    const poweredBy1 =`
-----------------------------------------
## Powered by @kebab-case/npm-simple-publisher`

    const poweredBy2 = `

This package has been brought to you by **[npm-simple-publisher](url=https://www.npmjs.com/package/@kebab-case/npm-simple-publisher)**

This little nodejs command-line script allows you to easily compile and publish node **and** es6 compliant code 
packages to npm. Init your project with minimal babel configuration for es6, compile to cjs and 
publish to npm with only two commands.`

    let index = readmeData.indexOf(poweredBy1)

    readmeData = readmeData.substr(0, (index > -1) ? index : readmeData.length )

    readmeData += poweredBy1 + poweredBy2

    fs.writeFileSync(contextDir + 'README.md', readmeData)

    await interactiveShell('npm', publishArgs, null, false)
}
