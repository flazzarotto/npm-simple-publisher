#!/usr/bin/env node
import fs from 'fs'
import {exec} from 'child_process'
import "core-js/stable"
import "regenerator-runtime/runtime"

if (!fs.lstatSync('src').isDirectory()) {
    throw new Error('This seems not to be a project directory, `src` folder is missing.')
}


(async function () {
    if (!fs.existsSync('.git')) {
        console.info('Init git repository')
        await exec('git init')
        await exec('yarn add -D @babel/cli')
        await exec('yarn add -D @babel/core')
        await exec('yarn add -D @babel/preset-env')
    }
})()
