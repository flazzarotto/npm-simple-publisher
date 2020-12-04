import fs from "fs";
import {exec} from "child_process"
import axios from "axios"
import {console, interactiveShell} from '@kebab-case/node-command-manager'

const buildOptions = [
    {
        name: 'skip-dependencies',
        type: 'boolean',
        short: 's',
        description: 'Skip adding dev dependencies',
        example: "'kc-nps build --skip-dependencies' or 'kc-nps build -s'"
    },
    {
        name: 'license',
        type: 'boolean',
        short: 'l',
        description: 'Generate license',
        example: "'kc-nps build --license' or 'kc-nps build -l'"
    },
]

export const buildMod = {
    mod: 'build',
    description: 'Add dependencies, license and run build',
    options: buildOptions,
    exec: build
}

export async function build(fileDir, contextDir, args) {

    args = {options: {}, ...args}

    const nspData = JSON.parse(fs.readFileSync(contextDir + 'config.local.json').toString())

    if (!fs.existsSync('.git')) {
        console.info('Init git repository')
        await exec('git init')

        if (nspData.NSP_REPOSITORY_SSH_REMOTE) {
            await exec('git checkout -b main && git add . && git commit -m "first commit"\n' +
            'git remote add origin '+nspData.NSP_REPOSITORY_SSH_REMOTE+'\n' +
            'git add . && git commit -m "first commit" && git push -u origin main')
        }
    }

    if (!args.options['skip-dependencies']) {
        console.info('Adding dev dependancies')
        await interactiveShell('yarn', ['add', '-D', '@babel/preset-env', '@babel/core',
                '@babel/cli', 'babel-eslint'],
            null, false)
        await interactiveShell('yarn', ['install'], null, false)
    }

    console.info('Yarn build')
    await interactiveShell('yarn', ['build'], null, false)

    if (args.options.license) {
        console.info('Generating license')
        const license = 'https://raw.githubusercontent.com/spdx/license-list-data/master/text/'
            + nspData.NSP_PACKAGE_LICENSE + '.txt'

        try {
            let body = (await axios.get(license)).data
            fs.writeFileSync(contextDir + 'LICENSE', body)
        }
        catch (error) {
            console.error(error)
            console.error('Error fetching `' + nspData.NSP_PACKAGE_LICENSE + '` license.')
        }
    }
}
