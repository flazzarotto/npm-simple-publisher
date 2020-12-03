import fs from "fs";
import {exec} from "child_process"
import request from "request"

const buildOptions = []

export const buildMod = {
    mod: 'build',
    description: 'Add dependencies, license and run build',
    options: buildOptions,
    exec: build
}

export async function build(fileDir, contextDir) {

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

    console.info('Adding dev dependancies')
    await exec('yarn add -D @babel/preset-env @babel/core @babel/cli ' +
        ' && yarn install && yarn build')

    console.info('Generating license')
    const license = 'https://raw.githubusercontent.com/spdx/license-list-data/master/text/'
        + nspData.NSP_PACKAGE_LICENSE + '.txt'

    request.get(license, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            fs.writeFileSync(contextDir + 'LICENSE', body)
        } else {
            console.error(response.statusCode)
            console.error('Error fetching `' + nspData.NSP_PACKAGE_LICENSE + '` license.')
        }
    })
}