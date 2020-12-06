#!/usr/bin/env node
import cmd from './index'
import fs from "fs"
import {console} from "@kebab-case/node-command-manager"

const contextDir = fs.realpathSync('.').replace(/\/+$/, '') + '/'
const fileDir = fs.realpathSync(__dirname).replace(/\/+$/, '') + '/'

;(async () => {
    await cmd.call(fileDir, contextDir)
})().catch((e) => {
    console.error(e)
})
