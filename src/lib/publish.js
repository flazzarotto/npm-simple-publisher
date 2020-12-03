import fs from "fs";
import {build} from "./build"
import prompt from 'prompt-async'
import {interactiveShell, updateVersion, getVersion} from "@kebab-case/node-command-manager"
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
        example: "'kc-nps publish --skip' or 'kc-nps publish -s'"
    },
    {
        name: 'yes',
        type: 'boolean',
        short: 'y',
        description: 'Publish without confirm',
        example: "'kc-nps publish --yes' or 'kc-nps publish -y'"
    }
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

    const logged = async () => {
        if (args.options['update-version']) {
            nspData.NSP_PACKAGE_VERSION = version
            fs.writeFileSync(contextDir + 'config.local.json', JSON.stringify(nspData, null, "\t"))
            console.info('Updating version to ' + version)
            generatePackageJson(fileDir, contextDir)
            if (nspData.NSP_REPOSITORY_SSH_REMOTE) {
                console.log('pushing new tag to git remote')
                exec(`git add . && git commit -m "version ${version}" && git tag -a v${version} -m `
                    + `"version ${version}" && git push && git push --tags`)
            }
        }

        console.log('ready to publish to npm')

        await exec('npm publish --access=public')
    }

    interactiveShell('npm', ['login'], {
        username: nspData.NSP_USERNAME,
        password: nspData.NSP_PASSWORD,
        emailthisispublic: nspData.NSP_EMAIL
    }, logged)

}
