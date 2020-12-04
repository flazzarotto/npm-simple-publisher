#!/usr/bin/env node
import cmd from './index'
import fs from "fs"
import {console} from "@kebab-case/node-command-manager"

const contextDir = fs.realpathSync('.').replace(/\/+$/, '') + '/'
const fileDir = fs.realpathSync(__dirname).replace(/\/+$/, '') + '/'

;(async () => {
    try {
        if (!fs.existsSync(contextDir+'src') || !fs.lstatSync(contextDir+'src').isDirectory()) {
            console.error('This seems not to be a project directory, `src` dir is missing.')
            return
        }
        await cmd.call(fileDir, contextDir)
    }
    catch (e) {
        throw e
    }
})().catch((e) => {
    console.error(e)
})
