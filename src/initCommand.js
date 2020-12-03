#!/usr/bin/env node
import fs from 'fs'
import argv from 'argv'
import {version} from "./lib/getVersion"
import "core-js/stable"
import "regenerator-runtime/runtime"
import {init, initOptions} from "./lib/init";

if (!fs.lstatSync('src').isDirectory()) {
    throw new Error('This seems not to be a project directory, `src` folder is missing.')
}

argv.option(initOptions)

argv.version(version)

const args = argv.run()

const dir = __dirname + '/../data/'

init(dir, args)